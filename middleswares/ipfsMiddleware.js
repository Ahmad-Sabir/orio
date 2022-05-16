const ObyteUser = require('../models/ObyteUser');
const ipfsAPI = require('ipfs-api');
const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS, ROLES } = require('../constants/index');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });

const ipfsVerificationMiddleware = catchAsync(async (req, res, next) => {
    // Getting User Data
    let { _id, secret } = req.body;
    console.log(_id);
    let { secret: databaseSecret } = await ObyteUser.findOne({ _id });
    let cid = await ipfs.dag.put(secret);
    cid = cid.toString();
    secret = cid;

    if (databaseSecret === secret) {
        return next();
    } else {
        return next(new AppError(ERRORS.UNAUTHORIZED.UNAUTHORIZE, STATUS_CODE.UNAUTHORIZED));
    }
});

module.exports = {
    ipfsVerificationMiddleware,
};
