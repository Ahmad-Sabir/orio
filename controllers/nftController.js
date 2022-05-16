const axios = require('axios');
const cron = require('node-cron');
const moment = require('moment');
const getHashed = require('../utilities/getTxId');
const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');
const Nft = require('../models/nftModel');
const SellAndBuyOrio = require('../models/SellAndBuyOrio');
const Bid = require('../models/bidModel');
const { filter } = require('./factoryHandler');
const NftTransaction = require('../models/nftTransactionModel');
const { transaction } = require('../utilities/transactions');
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
    refundToUser,
    refundFromAdmin,
} = require('../utilities/scripts');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS, ROLES } = require('../constants/index');

exports.createOne = catchAsync(async (req, res, next) => {
    req.body.creator = req.user._id;
    req.body.owner = req.user._id;
    const result = await Nft.create(req.body);
    res.status(STATUS_CODE.CREATED).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED,
        result,
    });
});

exports.buyNft = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const session = await Nft.startSession();
    await session.withTransaction(async () => {
        const result = await Nft.findOne({
            _id: id,
            owner: { $ne: req.user._id },
            selling: true,
        }).populate('creator owner');
        if (!result) {
            return next(new AppError('Nft Not Found', STATUS_CODE.NOT_FOUND));
        }
        if (!(await checkBalance(req, result.price))) {
            return next(
                new AppError(
                    `You don't have enough balance to buy this NFT`,
                    STATUS_CODE.BAD_REQUEST
                )
            );
        }
        const orioLatest = await orioLatestPrice();
        console.log(orioLatest);
        let orioNetworkFee = Number(result.price) * 0.01;
        //let sourceAmount = Number(result.price) * orioLatest;
        let sourceAmount = Number(result.price) - orioNetworkFee;
        console.log(sourceAmount);
        let royaltyAmount;
        let royaltyAmountPx;
        console.log(!result.creator._id.equals(result.owner._id));
        if (
            !result.creator._id.equals(result.owner._id) &&
            !result.creator._id.equals(req.user._id)
        ) {
            console.log('hello');
            royaltyAmount = sourceAmount * (result.royaltyBonus / 100);
            console.log(royaltyAmount);
            sourceAmount = sourceAmount - royaltyAmount;
            royaltyAmountPx = royaltyAmount * orioLatest;
            console.log(royaltyAmountPx);
        }
        sourceAmount = Number(sourceAmount) * orioLatest;
        sourceAmount = sourceAmount.toFixed(10);
        let orioNetPax = orioNetworkFee * orioLatest;
        console.log(orioNetworkFee, sourceAmount);
        let returnTransferToUser;
        try {
            returnTransferToUser = await axios.post(
                process.env.TRANSFER_API_V3,
                {
                    autoConfirm: true,
                    source: `wallet:${req.user.id}`,
                    sourceCurrency: 'PAX',
                    sourceAmount: `${sourceAmount}`,
                    destCurrency: `PAX`,
                    dest: `${result.owner.eth}`, // Send to the USER
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.MAIN_NET_TOKEN}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(returnTransferToUser);
        } catch (e) {
            return next(new AppError(e.response.data.message, STATUS_CODE.BAD_REQUEST));
        }
        if (!returnTransferToUser) {
            return next(new AppError('Error in sending amount', STATUS_CODE.BAD_REQUEST));
        }
        if (returnTransferToUser.data.status === 'FAILED') {
            console.log(returnTransferToUser);
            return next(new AppError('Transaction Failed', STATUS_CODE.BAD_REQUEST));
        }
        let body = {
            autoConfirm: true,
            source: `wallet:${req.user.id}`,
            sourceCurrency: `PAX`,
            sourceAmount: `${orioNetPax}`,
            destCurrency: 'PAX',
            dest: `${process.env.ADMIN_ETH_ADDRESS}`, // AC_QRJWR69HM6G
        };
        let returnTransferToAdmin;
        try {
            returnTransferToAdmin = await axios.post(process.env.TRANSFER_API_V3, body, {
                headers: {
                    Authorization: `Bearer ${process.env.MAIN_NET_TOKEN}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            console.log(returnTransferToAdmin);
        } catch (e) {
            console.log('catch');
            await refundToUser(returnTransferToUser.data);
            return next(new AppError(e.response.data.message, STATUS_CODE.BAD_REQUEST));
        }

        // transfer to user
        if (!returnTransferToAdmin) {
            console.log('catch1');
            await refundToUser(returnTransferToUser.data);
            return next(new AppError('Error in sending amount', STATUS_CODE.BAD_REQUEST));
        }
        if (returnTransferToAdmin.data.status === 'FAILED') {
            console.log('catch2');
            await refundToUser(returnTransferToUser.data);
            return next(new AppError('Admin Transaction Failed', STATUS_CODE.BAD_REQUEST));
        }
        if (
            !result.creator._id.equals(result.owner._id) &&
            !result.creator._id.equals(req.user._id)
        ) {
            let returnTransferToCreator;
            try {
                returnTransferToCreator = await axios.post(
                    process.env.TRANSFER_API_V3,
                    {
                        autoConfirm: true,
                        source: `wallet:${req.user.id}`,
                        sourceCurrency: 'PAX',
                        sourceAmount: `${royaltyAmountPx}`,
                        destCurrency: `PAX`,
                        dest: `${result.creator.eth}`, // Send to the USER
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.MAIN_NET_TOKEN}`,
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                );
            } catch (e) {
                console.log('error');
                //await refundToUser(returnTransferToUser.data);
                //await refundFromAdmin(returnTransferToAdmin.data);
                return next(new AppError(e.response.data.message, STATUS_CODE.BAD_REQUEST));
            }
            if (!returnTransferToCreator) {
                await refundToUser(returnTransferToUser.data);
                await refundFromAdmin(returnTransferToAdmin.data);
                return next(new AppError('Error in sending amount', STATUS_CODE.BAD_REQUEST));
            }
            if (returnTransferToCreator.data.status === 'FAILED') {
                await refundToUser(returnTransferToUser.data);
                await refundFromAdmin(returnTransferToAdmin.data);
                return next(
                    new AppError('Royality Bonus Transaction Failed', STATUS_CODE.BAD_REQUEST)
                );
            }
        }
        let orioTxId = getHashed();
        let { fees } = returnTransferToUser.data;
        let txFee = Object.entries(fees).length === 0 ? 0 : Object.values(fees)[0];
        console.log(txFee);
        let sourceOrio;
        if (!royaltyAmount) {
            royaltyAmount = 0;
        }
        if (txFee === 0) {
            txFee = txFee.toFixed(10);
            sourceOrio = sourceAmount / orioLatest + orioNetworkFee + royaltyAmount;
            sourceOrio = sourceOrio.toFixed(10);
            console.log(sourceOrio);
        } else {
            txFee = txFee.toFixed(10);
            sourceOrio =
                sourceAmount / orioLatest + txFee / orioLatest + orioNetworkFee + royaltyAmount;
            sourceOrio = sourceOrio.toFixed(10);
            console.log(sourceOrio);
        }
        const transcation = await SellAndBuyOrio.create(
            [
                {
                    previousOwner: result.owner._id,
                    currentOwner: req.user._id,
                    nft: result._id,
                    status: 'COMPLETED',
                    txId: returnTransferToUser.data.id,
                    orioAddress: req.user.userAddress,
                    orioTxId,
                    sourceCurrency: 'PAX',
                    sourceAmount: returnTransferToUser.data.sourceAmount,
                    destCurrency: returnTransferToUser.data.destCurrency,
                    destAmount: returnTransferToUser.data.destAmount,
                    orio: sourceOrio,
                    orioNetworkFee: orioNetworkFee,
                    txFee,
                    roalityBonusOrio: royaltyAmount,
                    orioPrice: orioLatest,
                    action: 'NFT',
                    dcp: 'SENDWYRE',
                },
            ],
            { session: session }
        );
        await updateBalance(-result.price, req.user.userAddress, session);
        await updateBalance(
            returnTransferToUser.data.destAmount / orioLatest,
            result.owner.userAddress,
            session
        );
        if (!result.creator._id.equals(result.owner._id)) {
            console.log('here', royaltyAmount, result.owner.userAddress);
            await updateBalance(royaltyAmount, result.creator.userAddress, session);
        }
        await ownership(
            transcation[0].nft,
            transcation[0].currentOwner,
            transcation[0].previousOwner,
            session
        );
        await Nft.findByIdAndUpdate(
            transcation[0].nft,
            { selling: false },
            { new: true, session: session }
        );
        res.status(STATUS_CODE.OK).json({
            status: STATUS.SUCCESS,
            message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
            result: transcation,
        });
    });
    session.endSession();
});

exports.placeBid = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const { bidAmount } = req.body;
    const session = await Nft.startSession();
    await session.withTransaction(async () => {
        const result = await Nft.findOne({
            _id: id,
            owner: { $ne: req.user._id },
            typeOfSale: 'Bid',
            selling: true,
        }).populate('creator owner');
        if (!result) {
            return next(new AppError('Nft Not Found', STATUS_CODE.NOT_FOUND));
        }
        if (!(await checkBalance(req, bidAmount))) {
            return next(
                new AppError(
                    `You don't have enough balance to Bid on this NFT`,
                    STATUS_CODE.BAD_REQUEST
                )
            );
        }
        if (!(await bidCheck(bidAmount, result._id, session))) {
            return next(
                new AppError(
                    `BidAmount should be higher than previous bid`,
                    STATUS_CODE.BAD_REQUEST
                )
            );
        }
        if (bidAmount < result.price) {
            return next(
                new AppError(`BidAmount should be higher than start price`, STATUS_CODE.BAD_REQUEST)
            );
        }
        await Bid.create([{ bider: req.user._id, bidPrice: bidAmount, nft: result._id }], {
            session: session,
        });

        await balanceToOnHold(bidAmount, req.user.userAddress, session);
        await onHoldToBalance(result._id, session);
        return res.status(STATUS_CODE.OK).json({
            status: STATUS.SUCCESS,
            message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        });
    });
    session.endSession();
});

exports.sellNft = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const { typeOfSale, price } = req.body;
    if (typeOfSale === 'Bid') {
        if (req.body.days) {
            let m = moment().add(req.body.days, 'days').endOf('day');
            //let d = new Date(m);
            req.body.auctionExpireTime = m;
            console.log(req.body.auctionExpireTime);
        }
    }
    const nft = await Nft.findById(id);
    if (nft.selling) {
        return next(new AppError('Already on sale', STATUS_CODE.BAD_REQUEST));
    }
    if (price <= nft.minPrice) {
        return next(
            new AppError('Price should be greater then NFT min price', STATUS_CODE.BAD_REQUEST)
        );
    }
    if (typeOfSale === 'Bid') {
        if (!req.body.days || req.body.days <= 0 || req.body.days > 10) {
            return next(new AppError('Please Enter days from 1 to 10', STATUS_CODE.BAD_REQUEST));
        }
    }
    let filteredBody = filterObj(req.body, 'typeOfSale', 'price', 'auctionExpireTime');
    filteredBody.selling = true;
    const result = await Nft.findByIdAndUpdate(id, filteredBody, { new: true });
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE,
        result,
    });
});

// exports.bidNft = catchAsync(async (req, res, next) => {
//     await auctionExpire(process.env.MAIN_NET_TOKEN);
//     res.status(STATUS_CODE.OK).json({
//         status: STATUS.SUCCESS,
//         message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE,
//         //result,
//     });
// });

const task = cron.schedule('0 0 * * *', async () => {
    await auctionExpire(process.env.MAIN_NET_TOKEN);
});
task.start();

exports.updateOne = catchAsync(async (req, res, next) => {
    let filteredBody = filterObj(req.body, 'typeOfSale', 'price');
    const result = await Nft.findByIdAndUpdate(req.params.id, filteredBody, { new: true });
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE,
        result,
    });
});

exports.getOne = catchAsync(async (req, res, next) => {
    const result = await Nft.findById(req.params.id);
    if (!result) {
        return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        result,
    });
});

exports.getMine = catchAsync(async (req, res, next) => {
    const [result, totalCount, leftCount] = await filter(
        Nft.find({ owner: req.user._id })
        .populate({ path: 'owner', select: 'userName' })
        .populate({ path: 'creator', select: 'userName' })
        .populate({ path: 'previousOwner', select: 'userName' })
        .populate('bids'),
        req.query
    );
    if (!result) {
        return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        countOnPage: result.length,
        totalCount: totalCount,
        leftCount,
        result,
    });
});

exports.getAll = catchAsync(async (req, res, next) => {
    const [result, totalCount, leftCount] = await filter(
        Nft.find({ owner: { $ne: req.user._id }, selling: true })
            .populate({ path: 'owner', select: 'userName' })
            .populate({ path: 'creator', select: 'userName' })
            .populate({ path: 'previousOwner', select: 'userName' })
            .populate('bids'),
        req.query
    );
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        countOnPage: result.length,
        totalCount: totalCount,
        leftCount,
        result,
    });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
    const result = await Nft.findByIdAndRemove(req.params.id);
    if (!result) {
        return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.DELETE,
        result: null,
    });
});

// exports.activate = catchAsync(async (req, res, next) => {
//     const result = await Nft.findById(req.params.id);
//     if (!result) {
//         return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
//     }
//     result.active = !result.active;
//     await result.save();
//     res.status(STATUS_CODE.OK).json({
//         status: STATUS.SUCCESS,
//         message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE,
//     });
// });

exports.unsell = catchAsync(async (req, res, next) => {
    const result = await Nft.findById(req.params.id);
    if (!result) {
        return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
    if (result.selling && result.typeOfSale === 'Bid') {
        return next(new AppError(`Can't set to unsell when on Auction`, STATUS_CODE.BAD_REQUEST));
    }
    result.selling = false;
    await result.save();
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE,
    });
});
