const axios = require('axios');
const cron = require('node-cron');
const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');
const Nft = require('../models/nftModel');
const Bid = require('../models/bidModel');
const NftTransaction = require('../models/nftTransactionModel');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS } = require('../constants/index');

exports.getOne = catchAsync(async (req, res, next) => {
    const result = await NftTransaction.findById(req.params.id);
    if (!result) {
        return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        result,
    });
});

exports.getAll = catchAsync(async (req, res, next) => {
    const result = await NftTransaction.find();
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        result,
    });
});

exports.getMine = catchAsync(async (req, res, next) => {
    const result = await NftTransaction.find({
        $or: [{ previousOwner: req.user._id }, { currentOwner: req.user._id }],
    });
    if (!result) {
        return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        result,
    });
});
