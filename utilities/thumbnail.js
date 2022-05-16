exports.uploadFile = async (file, uId) => {
    let myFile = file.originalname.split('.');
    const ext = myFile[myFile.length - 1];
    const uploadParams = {
        Bucket: bucketName,
        Body: file.buffer,
        Key: `${uId}.${ext}`,
        CacheControl: 'max-age=86400',
        ContentType: file.mimetype,
    };
    const obj = await s3.upload(uploadParams).promise();
    return obj.Location;
};
