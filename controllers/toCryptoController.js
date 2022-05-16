const axios = require('axios');
const mongoose = require('mongoose');
const cron = require('node-cron');
const getHashed = require('../utilities/getTxId');
const SellAndBuyOrio = require('../models/SellAndBuyOrio');
const VerifyTransaction = require('../models/VerifyTransaction');
const ObyteUser = require('../models/ObyteUser');
const Balance = require('../models/Balance');
const OrioPrices = require('../models/OrioPrices');
const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');
const jwtManagement = require('../utilities/jwtManagement');
const { filter } = require('./factoryHandler');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS, ROLES } = require('../constants/index');
const { getBtcUsd } = require('../utilities/btc-usd');
const { convert } = require('../utilities/currencies/converter');
const {
    checkBalance,
    orioLatestPrice,
    updateBalance,
    balanceToOnHold,
    onHoldToBalance,
    filterObj,
    bidCheck,
    ownership,
    auctionExpire,
} = require('../utilities/scripts');
const { transaction } = require('../utilities/transactions');

const priceFormula = require('../utilities/priceFormula');

exports.transfersWyre = catchAsync(async (req, res, next) => {
    const session = await SellAndBuyOrio.startSession();
    await session.withTransaction(async () => {
        let { dcp, sourceAmount, sourceCurrency, token, source } = req.body;
        if (!dcp || !sourceAmount || !sourceCurrency || !token || !source) {
            return next(new AppError('Invalid prameters', STATUS_CODE.BAD_REQUEST));
        }
        const parameters = {
            sourceAmount: sourceAmount,
            sourceCurrency: sourceCurrency,
            dest: process.env.DEST,
            destCurrency: process.env.DEST_CURRENCY,
            source: `${source}`,
        };
        let { data } = await axios.post(process.env.TRANSFER_API_V3, parameters, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        let txId = data.id;
        let feeInUsd = data.totalFees;
        let recieveAmount = data.destAmount;
        let orioTransactionId = getHashed();
        let orioNetworkFee = recieveAmount * 0.01;
        let orio = Number(recieveAmount) - Number(orioNetworkFee);
        let sourceCurrence = data.sourceCurrency;
        let destinationCurrency = data.destinationCurrency;
        let exchangeRate = data.exchangeRate;
        let transactionFee = data.totalFees;

        await SellAndBuyOrio.create(
            [
                {
                    dcp,
                    txId,
                    sourceCurrence: sourceAmount,
                    destinationCurrency: recieveAmount,
                    action: 'BUY',
                    orio,
                    feeInUsd,
                    totalAmount: sourceAmount,
                    orioTransactionId,
                    recieveAmount,
                    orioNetworkFee,
                    orioAddress: req.user.userAddress,
                    exchangeRate,
                },
            ],
            { session: session }
        );

        await VerifyTransaction.create(
            [
                {
                    userOrioAddress: req.user.userAddress,
                    txId,
                    amount: sourceAmount,
                    sourceCurrence,
                    destinationCurrency,
                    orioAmount: orio,
                    status: 'PENDING',
                },
            ],
            { session: session }
        );
        res.status(STATUS_CODE.OK).json({
            status: STATUS.SUCCESS,
            message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
            result: {
                sourceCurrency: sourceCurrence,
                sourceAmount: sourceAmount,
                orioNetworkFee,
                orioRecieveByUser: recieveAmount,
                status: 'PENDING',
                transactionFee,
            },
        });
    });
    session.endSession();
});

exports.confirmTransfersWyre = catchAsync(async (req, res, next) => {
    /* NOT IN USE */
    let { transferId, token } = req.body;
    let url = `${process.env.TRANSFER_API_V3}/${transferId}/confirm`;
    if (!transferId || !token) {
        return next(new AppError('Transfer Id or Token in not valid', STATUS_CODE.BAD_REQUEST));
        //throw new Error('Transfer Id or Token in not valid');
    }
    let { data } = await axios.post(
        url,
        {
            email: 'usmanqasim0900@gmail.com',
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        }
    );
    await SellAndBuyOrio.create({
        dcp: 'DCP1',
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
    });
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        result: data,
    });
});

exports.createTransfer = catchAsync(async (req, res, next) => {
    //   /* NOT IN USE */
    let { source, sourceCurrency, sourceAmount, token } = req.body;
    if (!source || !sourceCurrency || !sourceAmount || !token) {
        return next(new AppError('Error in prameters', STATUS_CODE.BAD_REQUEST));
    }
    let { data } = await axios.post(
        process.env.TRANSFER_API_V3,
        {
            autoConfirm: true,
            source: `${source}`,
            sourceCurrency: `${sourceCurrency}`,
            sourceAmount: `${sourceAmount}`,
            destCurrency: 'PAX',
            dest: `${process.env.ADMIN_ETH_ADDRESS}`,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        result: data,
    });
});

/*
  BUY ORIO CONTROLLER
*/
exports.buyOrio = catchAsync(async (req, res, next) => {
    const authToken = process.env.MAIN_NET_TOKEN;
    const walletId = req.user.id;
    const orioAddress = req.user.userAddress;
    const ethAddress = req.user.eth;
    if (!ethAddress || !orioAddress || !walletId || !ethAddress) {
        return next(new AppError('Required prameters are missing', STATUS_CODE.BAD_REQUEST));
    }
    // Checking the History and finding the new records
    const URL = `${process.env.TRANSFER_API_V2}/wallet:${walletId}`;
    let token = `Bearer ${authToken}`;
    const { data: respData } = await axios.get(URL, {
        headers: { Authorization: token },
    });
    const { data } = respData;
    if (data.length == 0) {
        return next(new AppError('No new Record into the history', STATUS_CODE.BAD_REQUEST));
    }
    for (let d in data) {
        let id = data[d].id;
        console.log(id);
        const exists = await SellAndBuyOrio.find({ txId: id });
        if (exists.length > 0) {
            continue;
        }
        //If Not Exist check these prameters
        //Type: incomming
        if (data[d].type !== 'INCOMING') {
            continue;
        }
        // source: External || sourceCurrency
        if (!data[d].source.includes('EXTERNAL') && data[d].sourceCurrency !== 'USD') {
            continue; // skip
        }
        let {
            fees: txFees,
            id: txId,
            destAmount,
            destCurrency,
            sourceCurrency,
            sourceAmount,
            status,
        } = data[d];
        let Tf;
        let txFee = 0;
        let totalOrio;
        let orioNetworkFee;
        let orioPax;
        let orio;
        let dA;
        if (destCurrency !== 'BTC') {
            dA = destAmount;
            const orioPrice = await orioLatestPrice();
            txFee = Object.entries(txFees).length === 0 ? 0 : Object.values(txFees)[0];
            totalOrio = Number(dA) / orioPrice;
            orioNetworkFee = Number(totalOrio) * 0.01;
            orioPax = orioNetworkFee * orioPrice;
            orio = Number(totalOrio) - Number(orioNetworkFee);
            console.log(txFee, totalOrio, orioNetworkFee, orio);
        }
        if (destCurrency === 'BTC') {
            dA = destAmount;
            dA = dA - 0.0001;
            dA = dA.toFixed(10);
            let response;
            try {
                response = await axios.post(
                    process.env.TRANSFER_API_V3,
                    {
                        autoConfirm: true,
                        source: `wallet:${walletId}`,
                        sourceCurrency: 'BTC',
                        sourceAmount: `${dA}`,
                        destCurrency: 'PAX',
                        dest: ethAddress,
                    },
                    {
                        headers: {
                            Authorization: `${token}`,
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                );
            } catch (e) {
                return next(new AppError(e.response.data.message, STATUS_CODE.BAD_REQUEST));
            }
            let { data } = response;
            dA = data.destAmount;
            // Assigning Values
            const orioCalculatedPrice = await orioLatestPrice();
            totalOrio = Number(dA) / Number(orioCalculatedPrice);
            orioNetworkFee = Number(totalOrio) * 0.01;
            orioPax = orioNetworkFee * orioCalculatedPrice;
            orioPax = orioPax.toFixed(10);
            orio = Number(totalOrio) - Number(orioNetworkFee);
            destCurrency = 'PAX';
            console.log(txFee, totalOrio, orioNetworkFee, orio);
        }
        let orioTxId = getHashed();
        let dcp = 'SENDWYRE';
        if (!orioNetworkFee) {
            Tf = 0.3;
        } else {
            Tf = orioNetworkFee;
        }
        let orioPrice = await orioLatestPrice();
        const sellBuy = new SellAndBuyOrio({
            txId,
            orioAddress,
            orioTxId,
            sourceCurrency,
            sourceAmount,
            destCurrency,
            destAmount: dA,
            orio,
            orioNetworkFee,
            txFee,
            action: 'BUY',
            dcp,
            status,
            orioPrice,
        });
        if (data[d].status == 'COMPLETED') {
            let responseBalance = await Balance.findOne({
                '_id.orioAddress': orioAddress,
                '_id.source': dcp,
            });
            let orioLastPrice = await orioLatestPrice();
            let grossBalance = Number(responseBalance.balance) + Number(orio);
            const filter = {
                '_id.orioAddress': responseBalance._id.orioAddress,
                '_id.source': dcp,
            };
            const update = { balance: grossBalance };
            await Promise.all([await Balance.findOneAndUpdate(filter, update), sellBuy.save()]);

            // Transaction Completed Send Data to the Admin
            orioNetworkFee = Number(orioNetworkFee) * Number(orioLastPrice);

            let body = {
                autoConfirm: true,
                source: `wallet:${walletId}`,
                sourceCurrency: `${destCurrency}`,
                sourceAmount: `${orioNetworkFee}`,
                destCurrency: 'PAX',
                dest: `${process.env.ADMIN_ETH_ADDRESS}`, // AC_QRJWR69HM6G
            };
            try {
                await axios.post(process.env.TRANSFER_API_V3, body, {
                    headers: {
                        Authorization: `${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
            } catch (e) {
                return next(new AppError(e.response.data.message, STATUS_CODE.BAD_REQUEST));
            }
        }
        await priceFormula(Tf, orio);
    }
    return res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: 'Buy Orio process completed',
    });
});
exports.sellOrio = catchAsync(async (req, res, next) => {
    // Get Data From the Frontend
    const { destinationCurrency, amount, destinationAddress, token } = req.body;
    const walletId = req.user.id;
    const orioAddress = req.user.userAddress;
    if (
        !walletId ||
        !orioAddress ||
        !destinationCurrency ||
        !amount ||
        !destinationAddress ||
        !token
    ) {
        return next(new AppError('Required prameters are missing', STATUS_CODE.SERVER_ERROR));
    }
    const con = await convert(destinationCurrency, 'PAX');
    console.log(con.data.PAX);
    // Check for Enough Coins
    const user = await Balance.findOne({ '_id.orioAddress': orioAddress });
    if (!user || Number(user.balance) < Number(amount)) {
        return next(new AppError('Not Enough coins for this transaction', STATUS_CODE.BAD_REQUEST));
    }

    // Dividing with in sell multiply here.
    let orioCalculatedPrice = await orioLatestPrice();
    let orioNetworkFee = Number(amount) * 0.01;
    let sourceAmount = Number(amount) * orioCalculatedPrice;
    sourceAmount = sourceAmount.toFixed(10);
    let orioNetPax = orioNetworkFee * orioCalculatedPrice;
    sourceAmount = sourceAmount - orioNetPax.toFixed(10);
    console.log(orioNetworkFee, sourceAmount);
    let returnTransferToUser;
    try {
        returnTransferToUser = await axios.post(
            process.env.TRANSFER_API_V3,
            {
                autoConfirm: true,
                source: `wallet:${walletId}`,
                sourceCurrency: 'PAX',
                sourceAmount: `${sourceAmount}`,
                destCurrency: `${destinationCurrency}`,
                dest: `${destinationAddress}`, // Send to the USER
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (e) {
        return next(new AppError(e.response.data.message, STATUS_CODE.BAD_REQUEST));
    }
    if (!returnTransferToUser) {
        return next(new AppError('Cannot send crypto to the User', STATUS_CODE.BAD_REQUEST));
    }

    // Transfer Orio Network Fee in crypto to Admin

    // let { data: returnTransferToAdmin } = await axios.post(
    //     process.env.TRANSFER_API_V3,
    //     {
    //         autoConfirm: true,
    //         source: `wallet:${walletId}`,
    //         sourceCurrency: 'PAX',
    //         sourceAmount: `${orioNetPax}`,
    //         destCurrency: 'PAX',
    //         dest: `${process.env.ADMIN_ETH_ADDRESS}`, // Send to the Admin
    //     },
    //     {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //     }
    // );
    // if (!returnTransferToAdmin) {
    //     return next(new AppError('Cannot send crypto to the User', STATUS_CODE.BAD_REQUEST));
    // }

    /////////////////////////////
    //    APPLY TRANSACTION
    ///////////////////////////// // Nov 19, 2021 ?
    // let {orioCalculatedPrice: orioLastPrice } = await OrioPrices.findOne().sort({createdAt: -1});
    // let totalOrio = Number(destAmount) / Number(orioLastPrice)

    let orioTxId = getHashed();
    console.log(returnTransferToUser.data);
    let { fees, id, destAmount } = returnTransferToUser.data;
    let srcAmount = returnTransferToUser.data.sourceAmount;
    let txFee = Object.keys(fees).length === 0 ? 0 : Object.values(fees)[0];
    console.log(orioNetworkFee);
    let txFeeOrio;
    console.log(orioNetworkFee, srcAmount, txFeeOrio);
    let orio;
    if (txFee !== 0) {
        txFeeOrio = txFee / Number(orioCalculatedPrice);
        orio = Number(amount) + Number(txFeeOrio);
    } else {
        txFeeOrio = 0;
        orio = Number(amount) + Number(txFeeOrio);
    }
    // console.log(orio);

    ///////////////////
    // GET ORIO PRICE
    ///////////////////
    let Tf;
    if (!orioNetworkFee) {
        Tf = 0.3;
    } else {
        Tf = orioNetworkFee;
    }
    let orioPrice = await orioLatestPrice();
    let prameters = {
        status: returnTransferToUser.data.status,
        txId: id,
        orioAddress: req.user.userAddress,
        orioTxId,
        sourceCurrency: 'PAX',
        sourceAmount: srcAmount,
        destCurrency: destinationCurrency,
        destAmount,
        orio,
        orioNetworkFee: orioNetworkFee,
        txFee,
        orioPrice,
        action: 'SELL',
        dcp: 'SENDWYRE',
    };
    const sell = new SellAndBuyOrio(prameters);
    // Deduct the Balance
    //let balance = Number(user.balance) - Number(orio);
    await Promise.all([
        sell.save(),
        //,await Balance.findOneAndUpdate({ '_id.orioAddress': orioAddress }, { $set: { balance } }),
    ]);
    // implement
    /////////////////////////////
    //console.log(Tf, orio);
    //await priceFormula(Tf, orio);
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: 'Crypto transaction Initiated',
    });
});
////////////////////
// General Function
////////////////////
const sellfiatFunc = async (pramaters) => {
    const {
        source,
        paymentMethodType,
        country,
        currency,
        paymentType,
        accountNumber,
        firstNameOnAccount,
        lastNameOnAccount,
        routingNumber,
        accountType,
        autoConfirm,
        sourceCurrency,
        destCurrency,
        destAmount,
        token,
    } = pramaters;
    try {
        if (
            !source ||
            !paymentMethodType ||
            !country ||
            !currency ||
            !paymentType ||
            !firstNameOnAccount ||
            !lastNameOnAccount ||
            !accountNumber ||
            !routingNumber ||
            !accountType ||
            !autoConfirm ||
            !sourceCurrency ||
            !destCurrency ||
            !destAmount ||
            !token
        ) {
            throw new Error('Missing Prameters');
        }

        return response;
    } catch (e) {
        return e;
    }
};

const sendToUser = async (
    walletId,
    sourceAmount,
    destinationCurrency,
    destinationAddress,
    token
) => {
    try {
        let { data } = await axios.post(
            process.env.TRANSFER_API_V3,
            {
                autoConfirm: true,
                source: `wallet:${walletId}`,
                sourceCurrency: 'PAX',
                sourceAmount: `${sourceAmount}`,
                destCurrency: `${destinationCurrency}`,
                dest: `${destinationAddress}`, // Send to the USER
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
        return data;
    } catch (e) {
        return;
    }
};

const sendToAdmin = async (walletId, orioNetworkFee, token) => {
    try {
        let { data } = await axios.post(
            process.env.TRANSFER_API_V3,
            {
                autoConfirm: true,
                source: `wallet:${walletId}`,
                sourceCurrency: 'PAX',
                sourceAmount: `${orioNetworkFee}`,
                destCurrency: 'PAX',
                dest: `${process.env.ADMIN_ETH_ADDRESS}`, // Send to the Admin
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
        return data;
    } catch (e) {
        return e;
    }
};
/*
    SELL With Fiat
*/
exports.sellfiat = catchAsync(async (req, res, next) => {
    const { source, autoConfirm, sourceCurrency, destCurrency, destAmount, token } = req.body;
    const {
        paymentMethodType,
        country,
        currency,
        paymentType,
        accountNumber,
        firstNameOnAccount,
        lastNameOnAccount,
        routingNumber,
        accountType,
    } = req.body.dest;

    let pramaters = {
        source,
        paymentMethodType,
        country,
        currency,
        paymentType,
        accountNumber,
        firstNameOnAccount,
        lastNameOnAccount,
        routingNumber,
        accountType,
        autoConfirm,
        sourceCurrency,
        destCurrency,
        destAmount,
        token,
    };

    try {
        const response = await sellfiatFunc(pramaters);
        if (response && response.message) {
            return next(new AppError(response.message, STATUS_CODE.BAD_REQUEST));
        }
        res.status(STATUS_CODE.OK).json({
            status: STATUS.SUCCESS,
            message: 'Transaction Has Been Completed Successfully',
        });
    } catch (e) {
        return next(new AppError(e.message, STATUS_CODE.BAD_REQUEST));
    }
});

exports.sellWithFiat = catchAsync(async (req, res, next) => {
    // Get Data From the Frontend
    const walletId = req.user.id;
    const orioAddress = req.user.userAddress;
    const {
        amount,
        token,
        routingNumber,
        accountType,
        accountNumber,
        currency,
        firstNameOnAccount,
        lastNameOnAccount,
        paymentMethodType,
        country,
        beneficiaryAddress2,
        beneficiaryCity,
        beneficiaryPhoneNumber,
        clabe,
        beneficiaryName,
        swiftBic,
        bankCode,
        branchCode,
        accountHolderPhoneNumber,
        cpfCnpj,
        bsbNumber,
        beneficiaryType,
        beneficiaryAddress,
        chargeablePM,
    } = req.body;
    const usr = await Balance.findOne({ '_id.orioAddress': orioAddress });
    if (!usr || Number(usr.balance) < Number(amount)) {
        return next(new AppError('Not Enough coins for this transaction', STATUS_CODE.BAD_REQUEST));
    }
    // // 2:
    // if (amount < 2) {
    //   throw new Error('Amount must be greater then 2');
    // }
    let orioPrice = await orioLatestPrice();
    let orioNetworkFee = amount * 0.01;
    let sourceAmount = Number(amount) - orioNetworkFee;
    sourceAmount = sourceAmount * orioPrice;
    sourceAmount = sourceAmount.toFixed(10);
    console.log(sourceAmount, amount, orioPrice);
    let destinationCurrency = currency;
    let body = {
        source: `wallet:${walletId}`,
        dest: {
            paymentMethodType,
            country,
            currency,
            accountNumber,
            accountType,
            beneficiaryAddress,
            beneficiaryAddress2,
            beneficiaryCity,
            beneficiaryName,
            beneficiaryPhoneNumber,
        },
        sourceCurrency: 'PAX',
        destCurrency: destinationCurrency,
        sourceAmount: `${sourceAmount}`,
    };
    ////////////////////////////////////
    // We have to change the prameters
    ////////////////////////////////////
    if (country === 'MX') {
        if (!clabe || !firstNameOnAccount || !lastNameOnAccount) {
            return next(new AppError('Clabe Not Found', STATUS_CODE.BAD_REQUEST));
        }
        body = {
            walletId: body.source,
            dest: {
                ...body.dest,
                clabe,
                firstNameOnAccount,
                lastNameOnAccount,
            },
            //...body.dest,
            sourceCurrency: body.sourceCurrency,
            destCurrency: body.destCurrency,
            sourceAmount: body.sourceAmount,
            // clabe,
            // firstNameOnAccount,
            // lastNameOnAccount,
        };
    } else if (country === 'UK') {
        if (!beneficiaryName || !swiftBic || !firstNameOnAccount || !lastNameOnAccount) {
            return next(
                new AppError('beneficiaryName or swiftBic Not Found', STATUS_CODE.BAD_REQUEST)
            );
        }
        body = {
            walletId: body.source,
            dest: {
                ...body.dest,
                beneficiaryName,
                swiftBic,
                firstNameOnAccount,
                lastNameOnAccount,
            },
            sourceCurrency: body.sourceCurrency,
            destCurrency: body.destCurrency,
            sourceAmount: body.sourceAmount,
        };
    } else if (country === 'BR') {
        if (
            !bankCode ||
            !branchCode ||
            !accountNumber ||
            !accountHolderPhoneNumber ||
            !cpfCnpj ||
            !firstNameOnAccount ||
            !lastNameOnAccount
        ) {
            return next(
                new AppError(
                    'bankCode, branchCode, nameOnAccount, accountNumber, accountHolderPhoneNumber or cpfCnpj is Missing',
                    STATUS_CODE.BAD_REQUEST
                )
            );
        }

        let nameOnAccount = firstNameOnAccount + lastNameOnAccount;
        body = {
            walletId: body.source,
            dest: {
                ...body.dest,
                bankCode,
                branchCode,
                nameOnAccount,
                accountNumber,
                accountHolderPhoneNumber,
                cpfCnpj,
            },
            sourceCurrency: body.sourceCurrency,
            destCurrency: body.destCurrency,
            sourceAmount: body.sourceAmount,
        };
    } else if (country === 'US') {
        if (!routingNumber || !firstNameOnAccount || !lastNameOnAccount) {
            return next(
                new AppError(
                    'routingNumber, firstNameOnAccount or lastNameOnAccount Not Found',
                    STATUS_CODE.BAD_REQUEST
                )
            );
        }
        body = {
            walletId: body.source,
            dest: {
                ...body.dest,
                firstNameOnAccount,
                lastNameOnAccount,
                routingNumber,
            },
            sourceCurrency: body.sourceCurrency,
            destCurrency: body.destCurrency,
            sourceAmount: body.sourceAmount,
        };
    } else {
        console.log(body);
        console.log(beneficiaryType, beneficiaryName, beneficiaryAddress, swiftBic, chargeablePM);
        if (!beneficiaryType || !beneficiaryName || !beneficiaryAddress || !swiftBic) {
            return next(new AppError('Missing prameters in Else case', STATUS_CODE.BAD_REQUEST));
        }
        body = {
            walletId: body.source,
            dest: {
                ...body.dest,
                swiftBic,
                chargeablePM,
                beneficiaryType,
                beneficiaryName,
                beneficiaryAddress,
            },
            sourceCurrency: body.sourceCurrency,
            destCurrency: body.destCurrency,
            sourceAmount: body.sourceAmount,
        };
    }
    let returnTransferToUser;
    try {
        console.log(body);
        returnTransferToUser = await axios.post(
            process.env.TRANSFER_API_V3,
            //body,
            { ...body, autoConfirm: true },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (e) {
        return next(new AppError(e.response.data.message, STATUS_CODE.BAD_REQUEST));
    }
    if (!returnTransferToUser) {
        return next(new AppError('Cannot send crypto to the User', STATUS_CODE.BAD_REQUEST));
    }
    //Transfer Orio Network Fee in crypto to Admin
    // const returnTransferToAdmin = await sendToAdmin(walletId, orioNetworkFee * orioPrice, token);
    // if (!returnTransferToAdmin) {
    //     return next(new AppError('Cannot send crypto to the Admin', STATUS_CODE.BAD_REQUEST));
    // }
    let orioTxId = getHashed();
    console.log('check 3');
    var { totalFees: fees, id, destAmount } = returnTransferToUser.data;
    //let txFee = Object.keys(fees).length === 0 ? 0 : Object.values(fees)[0];
    //
    // Tested till this point
    //
    var { totalFees, id, destAmount } = returnTransferToUser.data;
    let srcAmount = returnTransferToUser.data.sourceAmount;
    //console.log(id, totalFees, destAmount);
    let orio = Number(amount) + totalFees / orioPrice;
    let Tf;
    if (!orioNetworkFee) {
        Tf = 0.3;
    } else {
        Tf = orioNetworkFee;
    }
    let prameters = {
        status: returnTransferToUser.data.status,
        txId: id,
        orioAddress: req.user.userAddress,
        orioTxId,
        sourceCurrency: 'PAX',
        sourceAmount: srcAmount,
        destCurrency: destinationCurrency,
        destAmount,
        orio,
        orioNetworkFee: orioNetworkFee,
        txFee: totalFees,
        action: 'SELL',
        dcp: 'SENDWYRE',
        orioPrice,
    };

    const sell = new SellAndBuyOrio(prameters);
    //const user = await Balance.findOne({ '_id.orioAddress': orioAddress });
    //let balance = Number(user.balance) - Number(orio);
    //await Balance.findOneAndUpdate({ '_id.orioAddress': orioAddress }, { $set: { balance } });
    await Promise.all([
        sell.save(),
        //await Balance.findOneAndUpdate({ '_id.orioAddress': orioAddress }, { $set: { balance } })
    ]);
    //await priceFormula(Tf, orio);
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: 'Transaction initiated will may take some time to be completed',
    });
});
/////
//=>
/////
const task = cron.schedule('*/20 * * * * *', async () => {
    await transaction();
});
task.start();
exports.getTopTenRecords = catchAsync(async (req, res, next) => {
    const response = await SellAndBuyOrio.find({}).sort({ _id: -1 }).limit(10);
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: response,
    });
});

exports.paginationOfTwentyRecords = async (req, res, next) => {
    let { limit, skip } = req.body;
    limit = limit.toString();
    skip = skip.toString();
    if (!limit || !skip) {
        return next(new AppError('Missing Prameters', STATUS_CODE.SERVER_ERROR));
    }
    limit = Number(limit);
    skip = Number(skip);

    const response = await SellAndBuyOrio.find({}).limit(limit).skip(skip).sort({ createdAt: -1 });
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: response,
    });
};

exports.getTransactionDetails = catchAsync(async (req, res, next) => {
    const { orioTxId } = req.body;
    const response = await SellAndBuyOrio.findOne({ orioTxId });
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: response,
    });
});

exports.getAllTransactionDetails = catchAsync(async (req, res, next) => {
    const [result, totalCount, leftCount] = await filter(SellAndBuyOrio.find(), req.query);
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        countOnPage: result.length,
        totalCount: totalCount,
        leftCount,
        result,
    });
});

exports.orioBalance = catchAsync(async (req, res, next) => {
    const { dcp } = req.body;
    if (!dcp) {
        return next(new AppError('dcp parameter is required', STATUS_CODE.SERVER_ERROR));
    }
    const orioAddress = req.user.userAddress;
    const response = await Balance.findOne({
        '_id.orioAddress': orioAddress,
        '_id.source': dcp,
    });
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: response,
    });
});

exports.allObyteUsers = catchAsync(async (req, res, next) => {
    const users = await ObyteUser.find({});
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: users,
    });
});

exports.transactionsCount = catchAsync(async (req, res, next) => {
    const numberOfTransactions = await SellAndBuyOrio.countDocuments({}).exec();
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: numberOfTransactions,
    });
});

exports.allObyteUsersCount = catchAsync(async (req, res, next) => {
    const obyteUsersCount = await ObyteUser.countDocuments({}).exec();
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: obyteUsersCount,
    });
});

exports.orioTotalBalance = catchAsync(async (req, res, next) => {
    const totalBalance = await Balance.find();
    let totalBalances = 0;
    for (let i = 0; i < totalBalance.length; i++) {
        const { balance } = totalBalance[i];
        console.log(balance);
        totalBalances += Number(balance);
    }
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: totalBalances,
    });
});

exports.countryData = catchAsync(async (req, res, next) => {
    let countries = [
        {
            country: 'Maxico',
            abbrevation: 'MX',
            currency: 'MXN',
        },
        {
            country: 'African Union',
            abbrevation: 'AU',
            currency: 'AUD',
        },
        {
            country: 'United Kingdom',
            abbrevation: 'UK',
            currency: 'GBP',
        },
        {
            country: 'Brazil',
            abbrevation: 'BR',
            currency: 'BRL',
        },
        {
            country: 'United States',
            abbrevation: 'US',
            currency: 'USD',
        },
    ];
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: countries,
    });
});

exports.userSellAndBuyRecord = catchAsync(async (req, res, next) => {
    let orioAddress = req.user.userAddress;
    if (!orioAddress) {
        return next(
            new AppError('Please Enter the Orio Address and Try Again', STATUS_CODE.BAD_REQUEST)
        );
    }
    const [result, totalCount, leftCount] = await filter(
        SellAndBuyOrio.find({ orioAddress }),
        req.query
    );
    //let response = await SellAndBuyOrio.find({ orioAddress }).exec();
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        countOnPage: result.length,
        totalCount: totalCount,
        leftCount,
        result,
    });
});
/*
  Orio Record for Last Week and Day
*/
const getDateWiseData = async (action, milliseconds) => {
    // Find Record for last week
    console.log(new Date(new Date().getTime() - milliseconds));
    const response = await SellAndBuyOrio.find({
        status: 'COMPLETED',
        action: `${action}`,
        createdAt: {
            $lte: new Date(),
            $gt: new Date(new Date().getTime() - milliseconds),
        },
    }).sort({ createdAt: 1 });
    // Add the Values and return these values
    console.log(response);
    let sum = 0;
    for (let i = 0; i < response.length; i++) {
        let { orio } = response[i];
        //console.log(orioPrice);
        if (orio) {
            sum += orio * 1;
        }
    }
    return sum;
};

exports.orioBalanceRecord = catchAsync(async (req, res, next) => {
    // Milli-Seconds in a Week
    let milliseconds = 604800000;
    let respSell = await getDateWiseData('SELL', milliseconds);
    //console.log(respSell);
    let respBuy = await getDateWiseData('BUY', milliseconds);
    console.log(respBuy);
    let responseWeek = Number(respBuy) - Number(respSell);
    console.log(responseWeek);
    //console.log(responseWeek);
    // Milli-Seconds in a Day
    milliseconds = 86400000;
    respSell = await getDateWiseData('SELL', milliseconds);
    console.log(respSell);
    respBuy = await getDateWiseData('BUY', milliseconds);
    let responseDay = Number(respBuy) - Number(respSell);
    console.log(responseDay);
    //console.log(milliseconds);
    // Getting Total balance
    const totalBalance = await Balance.find({});
    let totalBalances = 0;
    for (let i = 0; i < totalBalance.length; i++) {
        const { balance } = totalBalance[i];
        //console.log(balance);
        totalBalances += Number(balance);
    }
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: {
            totalBalances,
            responseDay,
            responseWeek,
        },
    });
});

exports.lastThirtyRecords = catchAsync(async (req, res, next) => {
    const response = await OrioPrices.find({}).sort({ createdAt: 1 }).limit(30);
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: response,
    });
});

exports.lastThirtyRecords = catchAsync(async (req, res, next) => {
    const response = await OrioPrices.find({}).sort({ createdAt: 1 }).limit(30);
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: response,
    });
});

exports.latestOrioPrice = catchAsync(async (req, res, next) => {
    const { orioCalculatedPrice } = await OrioPrices.findOne({}).sort({ createdAt: -1 });
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: orioCalculatedPrice,
    });
});

//////////////////
//    TEST
//////////////////
exports.getDateWiseRecord = async (req, res) => {
    try {
        const response = await OrioPrices.find({
            createdAt: {
                $lte: new Date().toString(),
                $gt: new Date(new Date().getTime() - 2592000000).toString(),
            },
        }).sort({ createdAt: 1 });

        // return res.send(response);
        // let Array = [];
        // Array.push({
        //   date : response[0].createdAt.toString().slice(0, 10),
        //   data : response[0]
        // })

        // for(let i = 1; i < response.length; i++){
        //   let currentDate = response[i].createdAt.toString().slice(0, 10);
        //   let j = Array.length - 1;
        //   let { date } =  Array[j];
        //   if(currentDate === date){
        //     // If Both are same push into the same one
        //     Array.push(response[i]);
        //   }else{
        //     // create a new Node
        //     Array.push({
        //       date : response[i].createdAt.toString().slice(0, 10),
        //       data : response[i]
        //     })
        //   }
        // }
        //////////////////////////////////////////////////
        // 6 Dec 2021 Monday 1:09 AM Line No 1370 to 1399
        //////////////////////////////////////////////////
        let responseArray = [];
        let date = response[0].createdAt;
        let object = {
            date,
            data: [response[0]],
        };
        for (let i = 1; i < response.length; i++) {
            let currentDate = response[i].createdAt.toString().slice(0, 10);
            let previousDate = response[i - 1].createdAt.toString().slice(0, 10);
            if (currentDate !== previousDate) {
                // If data already exist push it and then create a new one
                if (object.data.length) {
                    responseArray.push(object);
                    // object.data.length = 0;
                }
                object = {
                    date: response[i].createdAt,
                    data: [response[i]],
                };
            } else {
                // Append Array
                object.data.push(response[i]);
            }
        }
        responseArray.push(object);
        console.log(responseArray);
        res.send({
            status: 200,
            success: true,
            response: responseArray,
        });
    } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
            e.message = e.response.data.message;
        }
        res.send({
            status: 200,
            success: false,
            message: e.message,
        });
    }
};

exports.testPriceFormula = async (req, res) => {
    try {
        let Tf = 0.2;
        let orio = null;
        let orioPrice = await priceFormula(Tf, orio);
        res.send({
            status: 200,
            success: true,
            response: orioPrice,
        });
    } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
            e.message = e.response.data.message;
        }
        res.send({
            status: 200,
            success: false,
            message: e.message,
        });
    }
};
