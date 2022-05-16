const mongoose = require('mongoose');
const axios = require('axios');
const getHashed = require('../utilities/getTxId');
const SellAndBuyOrio = require('../models/SellAndBuyOrio');
const VerifyTransaction = require('../models/VerifyTransaction');
const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');
const btcTransactionRecord = require('../utilities/currencies/btcCase');
const ethTransactionRecord = require('../utilities/currencies/ethCase');
const ltcTransactionRecord = require('../utilities/currencies/ltcCase');
const bchTransactionRecord = require('../utilities/currencies/bchCase');
const txIdFormatVerification = require('../utilities/txIdFormatVerification');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS, ROLES } = require('../constants/index');

exports.currencyConversion = catchAsync(async (req, res, next) => {
    let response = await axios.get(process.env.ALL_CURRENCIES_TO_USD);
    response = response.data.data;
    const ArrayFormat = Object.entries(response);
    let ORIO_TO_BTC;
    let ORIO_TO_LTC;
    let ORIO_TO_BCH;
    let ORIO_TO_ETH;

    for (i = 0; i < ArrayFormat.length; i++) {
        if (ArrayFormat[`${i}`]['1'].name === 'Ethereum') {
            ORIO_TO_ETH = 1 / ArrayFormat[`${i}`]['1']['quotes']['USD'].price;
        } else if (ArrayFormat[`${i}`]['1'].name === 'Bitcoin') {
            ORIO_TO_BTC = 1 / ArrayFormat[`${i}`]['1']['quotes']['USD'].price;
        } else if (ArrayFormat[`${i}`]['1'].name === 'Litecoin') {
            ORIO_TO_LTC = 1 / ArrayFormat[`${i}`]['1']['quotes']['USD'].price;
        } else if (ArrayFormat[`${i}`]['1'].name === 'Bitcoin Cash') {
            ORIO_TO_BCH = 1 / ArrayFormat[`${i}`]['1']['quotes']['USD'].price;
        }
    }
    const { data } = await axios.get(process.env.URL_USDC);
    let { USDC } = data.data.rates;
    let ORIO_TO_USDC = Number(USDC);
    let ORIO_TO_USDT = Number(USDC);
    const { data: pax } = await axios.get(process.env.URL_PAX);
    const { PAX: ORIO_TO_PAX } = pax.data.rates;
    console.log(ORIO_TO_PAX);
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: {
            ORIO_TO_BTC,
            ORIO_TO_ETH,
            ORIO_TO_LTC,
            ORIO_TO_BCH,
            ORIO_TO_USDC,
            ORIO_TO_USDT,
            ORIO_TO_PAX,
        },
    });
});

exports.orioFee = catchAsync(async (req, res, next) => {
    if (!req.body.orio) {
        new AppError(`please enter orios`, STATUS_CODE.BAD_REQUEST);
    }
    let orio = req.body.orio;
    orio = orio * 0.01;
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: {
            orioNetworkFee: Number(orio.toFixed(4)),
        },
    });
});

exports.verifyTransaction = async (req, res) => {
    for (const property in req.body) {
        if (!req.body[property] || req.body[property] === '' || req.body[property] === undefined) {
            throw new Error(
                `${property} has an Error please check datatype null, empty or undefined`
            );
        }
    }

    let { txId, currency, userOrioAddress, dcp } = req.body;
    const validCurrencies = ['BTC', 'ETH', 'LTC', 'BCH'];
    if (!validCurrencies.includes(currency)) {
        return res.status(200).send({
            status: 200,
            success: false,
            message: 'Currency is not valid',
        });
    }
    if (await txIdFormatVerification(currency, txId)) {
        return res.status(200).send({
            status: 200,
            success: false,
            message: 'Invalid transaction id',
        });
    }
    // Perform transaction
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
        switch (currency) {
            case 'BTC':
                var {
                    feesInBtc: fees,
                    total,
                    amount,
                    orioFee,
                    orioAmount,
                    totalFee,
                    currencyInUsd,
                    txFeeInUsd,
                    message,
                } = await btcTransactionRecord(txId);
                if (!!message) {
                    throw new Error('Please Input Tx Id of BTC and try again');
                }
                break;
            case 'ETH':
                var {
                    feesInEth: fees,
                    total,
                    amount,
                    orioFee,
                    orioAmount,
                    totalFee,
                    currencyInUsd,
                    txFeeInUsd,
                    message,
                } = await ethTransactionRecord(txId);
                if (!!message) {
                    console.log(message);
                    throw new Error('Please Input Tx Id of ETH and try again');
                }
                break;
            case 'LTC':
                var {
                    feesInLtc: fees,
                    total,
                    amount,
                    orioFee,
                    orioAmount,
                    totalFee,
                    currencyInUsd,
                    txFeeInUsd,
                    message,
                } = await ltcTransactionRecord(txId);
                if (!!message) {
                    throw new Error('Please Input Tx Id of LTC and try again');
                }
                break;
            case 'BCH':
                var {
                    feesInBch: fees,
                    total,
                    amount,
                    orioFee,
                    orioAmount,
                    totalFee,
                    currencyInUsd,
                    txFeeInUsd,
                    message,
                } = await bchTransactionRecord(txId);
                if (!!message) {
                    throw new Error('Please Input Tx Id of BCH and try again');
                }
                break;
        }

        let orioTransactionId = getHashed();
        await SellAndBuyOrio.create(
            [
                {
                    dcp,
                    currency,
                    txId: txId,
                    action: 'BUY',
                    orio: orioAmount,
                    feeInUsd: txFeeInUsd,
                    totalAmount: total,
                    orioTransactionId,
                    recieveAmount: amount,
                    orioNetworkFee: orioFee,
                    orioAddress: userOrioAddress,
                },
            ],
            { session: session }
        );

        await VerifyTransaction.create(
            [
                {
                    userOrioAddress,
                    txId: txId,
                    amount: total,
                    currency: currency,
                    burntOrioAmount: orioAmount,
                    status: 'PENDING',
                },
            ],
            { session: session }
        );

        // End transaction
        await session.commitTransaction();
        session.endSession();
        res.status(200).send({
            success: true,
            total: total,
            txFeeInUsd: txFeeInUsd,
            tokenAmount: amount,
            orioNetworkFeeInUSD: orioFee,
            totalFee: totalFee,
            oiroThatYouWillGet: orioAmount,
            message: 'Tx confirmation will take some time',
        });
    } catch (e) {
        // Transaction end in case of failure
        await session.abortTransaction();
        session.endSession();
        res.status(200).send({
            status: 200,
            success: false,
            message: e.message,
        });
    }
};
