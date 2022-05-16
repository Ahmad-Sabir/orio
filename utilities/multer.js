const multer = require('multer');
const { memoryStorage } = require('multer');
const AppError = require('./AppError');

const upload = multer({
    storage: memoryStorage(),
    fileFilter: (req, file, callback) => {
        console.log(req, file);
        if (
            file.mimetype.startsWith('image') ||
            file.mimetype.startsWith('video') ||
            file.mimetype.startsWith('audio')
        ) {
            callback(null, true);
        } else {
            callback(
                new AppError(
                    `Not an image or application file! Please upload only image or video or audio files`,
                    400
                ),
                false
            );
        }
    },
});

module.exports = upload;
