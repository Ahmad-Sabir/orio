const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });
const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS, ROLES } = require('../constants/index');
const Nft = require('../models/nftModel');

const nftOwnerCheck = catchAsync(async (req, res, next) => {
    const find = await Nft.findOne({ _id: req.params.id, owner: req.user._id });
    if (!find) {
        return next(new AppError(ERRORS.UNAUTHORIZED.UNAUTHORIZE, STATUS_CODE.UNAUTHORIZED));
    }
    return next();
});

const nftOnSellCheck = catchAsync(async (req, res, next) => {
    const find = await Nft.findOne({ _id: req.params.id });
    if (find.selling) {
        return next(new AppError(ERRORS.UNAUTHORIZED.UNAUTHORIZE, STATUS_CODE.UNAUTHORIZED));
    }
    return next();
});

module.exports = { nftOwnerCheck, nftOnSellCheck };
