const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });
const Nft = require('../models/nftModel');
const AppError = require('../utilities/AppError');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS, ROLES } = require('../constants/index');
const catchAsync = require('../utilities/catchAsync');
const { uploadFile } = require('../utilities/s3');

const ipfsModule = catchAsync(async (req, res, next) => {
    if (req.file) {
        const file = await ipfs.files.add(req.file.buffer);
        console.log(file[0].hash);
        const exist = await Nft.findOne({ fileHash: file[0].hash });
        if (exist) {
            return next(new AppError('NFT Already Created', STATUS_CODE.BAD_REQUEST));
        }
        req.body.fileHash = file[0].hash;
        req.body.file = await uploadFile(req.file, file[0].hash);
        console.log('mimeType', req.file.mimetype);
        let fileType = req.file.mimetype;
        if (fileType.startsWith('image')) {
            req.body.fileType = 'image';
        } else if (fileType.startsWith('video')) {
            req.body.fileType = 'video';
        } else if (fileType.startsWith('audio')) {
            req.body.fileType = 'audio';
        }
    }
    return next();
});

module.exports = ipfsModule;
