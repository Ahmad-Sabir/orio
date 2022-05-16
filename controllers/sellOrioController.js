const mongoose = require('mongoose');
const axios = require('axios');
const Currencies = require('../models/currencies');
const Balance = require('../models/Balance');
const SellOrio = require('../models/SellOrio');
const Notification = require('../models/Notification');
const { orioLatestPrice } = require('../utilities/scripts');
const SellAndBuyOrio = require('../models/SellAndBuyOrio');
const VerifyTransaction = require('../models/VerifyTransaction');
const getHashed = require('../utilities/getTxId');
const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');
const { convert } = require('../utilities/currencies/converter');
const btcTransactionRecord = require('../utilities/currencies/btcCase');
const ethTransactionRecord = require('../utilities/currencies/ethCase');
const ltcTransactionRecord = require('../utilities/currencies/ltcCase');
const bchTransactionRecord = require('../utilities/currencies/bchCase');
const txIdFormatVerification = require('../utilities/txIdFormatVerification');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS, ROLES } = require('../constants/index');

exports.rejectRequest = catchAsync(async (req, res, next) => {
    for (const property in req.body) {
        if (!req.body[property] || req.body[property] === '' || req.body[property] === undefined) {
            return next(
                new AppError(
                    `${property} has an Error please check datatype null, empty or undefined`,
                    STATUS_CODE.BAD_REQUEST
                )
            );
        }
    }
    const { id } = req.body;
    await SellOrio.findOneAndUpdate({ _id: id }, { $set: { status: 'REJECTED' } });
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: 'Status has been updated successfully',
    });
});

exports.sellRequest = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
        for (const property in req.body) {
            if (
                !req.body[property] ||
                req.body[property] === '' ||
                req.body[property] === undefined
            ) {
                return next(
                    new AppError(
                        `${property} has an Error please check datatype null, empty or undefined`,
                        STATUS_CODE.BAD_REQUEST
                    )
                );
            }
        }
        let {
            orioAddress,
            userHandler,
            dcp,
            statFus,
            selectedCurrency,
            publicKey,
            orioAmount,
            amountInSelectedCurrency,
            memo,
            orioNetworkFee,
            token,
            source,
        } = req.body;
        // Convert to Number form
        orioAmount = Number(orioAmount);
        orioNetworkFee = Number(orioNetworkFee);
        amountInSelectedCurrency = Number(amountInSelectedCurrency);
        if (
            typeof orioAmount !== 'number' ||
            typeof orioNetworkFee !== 'number' ||
            typeof amountInSelectedCurrency !== 'number'
        ) {
            return next(new AppError('Invalid Orio Amount Format', STATUS_CODE.BAD_REQUEST));
        }

        // Check whether the enough coins exist or not in balance table?
        const response = await Balance.findOne({
            '_id.orioAddress': orioAddress,
            '_id.source': dcp,
        });
        if (!response) {
            return next(
                new AppError(
                    'Not enough coins for this transaction against selected DCP',
                    STATUS_CODE.BAD_REQUEST
                )
            );
        }
        if (Number(response.balance) < Number(orioAmount)) {
            return next(
                new AppError(
                    'Not enough coins for this transaction against selected DCP',
                    STATUS_CODE.BAD_REQUEST
                )
            );
        } else {
            const response = await SellOrio.findOne({ orioAmount, dcp, status: 'PENDING' });
            if (response && response._id) {
                return next(
                    new AppError(
                        'Already have a pending request please try again later.',
                        STATUS_CODE.BAD_REQUEST
                    )
                );
            }
            await SellOrio.create(
                [
                    {
                        dcp: dcp,
                        status: status,
                        publicKey: publicKey,
                        orioAmount: orioAmount,
                        orioAddress: orioAddress,
                        userHandler: userHandler,
                        selectedCurrency: selectedCurrency,
                        orioNetworkFee: orioNetworkFee,
                        amountInSelectedCurrency: amountInSelectedCurrency,
                        memo: memo,
                    },
                ],
                { session: session }
            );
            ////////////////////////
            // Second Section   ////
            ////////////////////////
            let sourceAmount = Number(orioAmount) - Number(orioNetworkFee);
            let body = {
                autoConfirm: true,
                source: `${source}`,
                sourceCurrency: 'PAX',
                sourceAmount: `${sourceAmount}`,
                destCurrency: `${selectedCurrency}`,
                dest: `${publicKey}`,
            };
            await axios.post(`https://api.tesywyre.com/v3/transfers`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            res.status(STATUS_CODE.OK).json({
                status: STATUS.SUCCESS,
                message: 'DCP will send your token on your provided address',
            });
        }
    });
    session.endSession();
});
exports.pendingRequest = catchAsync(async (req, res, next) => {
    const response = await SellOrio.find({ status: 'PENDING' });
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: response,
    });
});

exports.verifyTransaction = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
        for (const property in req.body) {
            if (
                !req.body[property] ||
                req.body[property] === '' ||
                req.body[property] === undefined
            ) {
                return next(
                    new AppError(
                        `${property} has an Error please check datatype null, empty or undefined`,
                        STATUS_CODE.BAD_REQUEST
                    )
                );
            }
        }
        const { userOrioAddress, txId, publicKey, currency, dcp } = req.body;

        if (!(txId && currency && userOrioAddress && dcp && publicKey)) {
            console.log('Missing parameters');
            return next(new AppError(`Missing parameters`, STATUS_CODE.BAD_REQUEST));
        }

        const validCurrencies = ['BTC', 'ETH', 'LTC', 'BCH'];
        if (!validCurrencies.includes(currency)) {
            return next(new AppError('Currency is not valid', STATUS_CODE.BAD_REQUEST));
        }

        if (await txIdFormatVerification(currency, txId)) {
            return next(new AppError('Invalid transaction id', STATUS_CODE.BAD_REQUEST));
        }

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
                    return next(new AppError(message, STATUS_CODE.BAD_REQUEST));
                }
                break;

            case 'ETH':
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
                } = await ethTransactionRecord(txId);
                if (!!message) {
                    return next(new AppError(message, STATUS_CODE.BAD_REQUEST));
                }
                break;

            case 'LTC':
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
                } = await ltcTransactionRecord(txId);
                if (!!message) {
                    return next(new AppError(message, STATUS_CODE.BAD_REQUEST));
                }
                break;

            case 'BCH':
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
                } = await bchTransactionRecord(txId);
                if (!!message) {
                    return next(new AppError(message, STATUS_CODE.BAD_REQUEST));
                }
                break;
        }

        let orioTransactionId = getHashed();
        await SellAndBuyOrio.create(
            [
                {
                    dcp,
                    txId,
                    currency,
                    action: 'SELL',
                    orio: orioAmount,
                    orioTransactionId,
                    feeInUsd: txFeeInUsd,
                    totalAmount: total,
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
                    txId,
                    currency,
                    publicKey,
                    amount: total,
                    burntOrioAmount: orioAmount,
                    userOrioAddress: userOrioAddress,
                    status: 'PENDING',
                },
            ],
            { session: session }
        );
    });
    session.endSession();
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: 'Tx confirmation will take some time',
    });
});

exports.getUserNotifications = catchAsync(async (req, res, next) => {
    for (const property in req.body) {
        if (!req.body[property] || req.body[property] === '' || req.body[property] === undefined) {
            return next(
                new AppError(
                    `${property} has an Error please check datatype null, empty or undefined`,
                    STATUS_CODE.BAD_REQUEST
                )
            );
        }
    }
    const orioAddress = req.user.userAddress;
    const notifications = await Notification.find({ orioAddress });
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: notifications,
    });
});

exports.getUserBalance = catchAsync(async (req, res, next) => {
    for (const property in req.body) {
        if (!req.body[property] || req.body[property] === '' || req.body[property] === undefined) {
            return next(
                new AppError(
                    `${property} has an Error please check datatype null, empty or undefined`,
                    STATUS_CODE.BAD_REQUEST
                )
            );
        }
    }
    const orioAddress = req.user.userAddress;
    const balances = await Balance.find({ '_id.orioAddress': orioAddress });
    if (balances.length === 0) {
        res.status(STATUS_CODE.OK).json({
            status: STATUS.SUCCESS,
            message: 'No Balance Found',
        });
    }
    let totalBalance = 0;
    for (i = 0; i < balances.length; i++) {
        totalBalance += balances[i].balance;
    }
    const currencies = await Currencies.find();
    let array = currencies.map((e) => e.iso_code);
    let coins = [];
    if (array.length > 0) {
        const data = await convert('PAX', array.join(','));
        const orioLatest = await orioLatestPrice();
        const object = data.data;
        for (const property in object) {
            const currency = await Currencies.findOne({ iso_code: property });
            const obj = {
                iso_code: property,
                amount: object[property] * orioLatest * totalBalance,
                title: currency?.title,
                icon: currency?.icon,
                symbol: currency?.symbol,
            };
            coins.push(obj);
        }
    }
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: {
            totalBalance,
            currencies: coins,
        },
    });
});

exports.getTenTransaction = catchAsync(async (req, res, next) => {
    const response = await SellAndBuyOrio.find({}).sort({ _id: -1 }).limit(10);
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: response,
    });
});

exports.getExceptTenTransaction = catchAsync(async (req, res, next) => {
    const response = await SellAndBuyOrio.find({}).skip(10);
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: response,
    });
});

exports.getTransactionDetail = catchAsync(async (req, res, next) => {
    for (const property in req.body) {
        if (!req.body[property] || req.body[property] === '' || req.body[property] === undefined) {
            return next(
                new AppError(
                    `${property} has an Error please check datatype null, empty or undefined`,
                    STATUS_CODE.BAD_REQUEST
                )
            );
        }
    }
    const orioTransactionId = req.body.orioTransactionId;
    const response = await SellAndBuyOrio.findOne({ orioTransactionId });
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: response,
    });
});

exports.getTransactionsDetails = catchAsync(async (req, res, next) => {
    for (const property in req.body) {
        if (!req.body[property] || req.body[property] === '' || req.body[property] === undefined) {
            return next(
                new AppError(
                    `${property} has an Error please check datatype null, empty or undefined`,
                    STATUS_CODE.BAD_REQUEST
                )
            );
        }
    }
    const orioAddress = req.user.orioAddress;
    const response = await SellAndBuyOrio.find({ orioAddress });
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: response,
    });
});
