const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');
const Currencies = require('../models/currencies');
const { uploadFile } = require('../utilities/s3');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS, ROLES } = require('../constants/index');

exports.createOne = catchAsync(async (req, res, next) => {
    if (req.file) {
        req.body.icon = await uploadFile(req.file);
    }
    const result = await Currencies.create(req.body);
    res.status(STATUS_CODE.CREATED).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.CREATED,
        result,
    });
});

exports.updateOne = catchAsync(async (req, res, next) => {
    if (req.file) {
        req.body.icon = await uploadFile(req.file);
    }
    const result = await Currencies.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.UPDATE,
        result,
    });
});

exports.getOne = catchAsync(async (req, res, next) => {
    const result = await Currencies.findById(req.params.id);
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
    const result = await Currencies.find();
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        result,
    });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
    const result = await Currencies.findByIdAndRemove(req.params.id);
    if (!result) {
        return next(new AppError(ERRORS.INVALID.NOT_FOUND, STATUS_CODE.NOT_FOUND));
    }
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.DELETE,
        result: null,
    });
});
