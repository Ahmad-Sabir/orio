const { countries } = require('../utilities/requiredData');
const rpc = require('json-rpc2');
const { exec } = require('child_process');
const ObyteUser = require('../models/ObyteUser');
const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');
const jwtManagement = require('../utilities/jwtManagement');
const Balance = require('../models/Balance');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS, ROLES } = require('../constants/index');
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });
const client = rpc.Client.$create(6332, 'localhost');
const axios = require('axios');
//console.log(client);

exports.register = catchAsync(async (req, res, next) => {
    let { userName, publicKey, secret } = req.body;
    if (!userName || !publicKey || !secret) {
        return next(new AppError('Missing parameters', STATUS_CODE.BAD_REQUEST));
    }
    // Storing data into the dag and get hash to store into the database for future authentication
    let cid = await ipfs.dag.put(secret);
    cid = cid.toString();
    secret = cid;

    if (await ObyteUser.findOne({ userName })) {
        // throw new Error("User Already Exist, Please choose different username");
        return next(
            new AppError(
                'User Already Exist, Please choose different username',
                STATUS_CODE.BAD_REQUEST
            )
        );
    }
    // Instead of client call we can use util.promisify to use async await syntax with it.
    client.call('getnewaddress', {}, function (err, userAddress) {
        console.log(userAddress);
        if (err) {
            console.log('GET new userAddress error : ', err);
            // console.log("====+++++++++++++++++++====");
            // process.exit();
            return next(new AppError('GET new userAddress Error', STATUS_CODE.BAD_REQUEST));
        }

        if (!userAddress || userAddress === undefined || userAddress === '') {
            console.log('Invalid parameters');
            return next(new AppError('Invalid parameters', STATUS_CODE.BAD_REQUEST));
        }

        exec(
            `python ${process.env.PYTHON_FILE_PATH} '${userAddress}' '${publicKey}'`,
            (error, encrypted, stderr) => {
                encrypted = encrypted.toString();
                console.log(encrypted);
                if (error) {
                    console.log(error.message);
                    return next(new AppError(error.message, STATUS_CODE.BAD_REQUEST));
                }
                if (stderr) {
                    console.log(stderr);
                    return next(new AppError(stderr, STATUS_CODE.BAD_REQUEST));
                }
                const dataIntoDataBase = async () => {
                    try {
                        //////////////////////////////////////////////////////
                        // First of all we integrate the Create Wyre Wallet.//
                        //////////////////////////////////////////////////////
                        let token = process.env.MAIN_NET_TOKEN;
                        let { data } = await axios.post(
                            process.env.WALLETS_API_V2,
                            {
                                name: `${userName}`,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        const _srn = data.id;
                        const _btc = data.depositAddresses.BTC;
                        const _avax = data.depositAddresses.AVAX;
                        const _xlm = data.depositAddresses.XLM;
                        const _eth = data.depositAddresses.ETH;

                        const responce = await ObyteUser.create({
                            id: _srn,
                            encryptedKey: encrypted,
                            userName: userName,
                            btc: _btc,
                            avax: _avax,
                            xlm: _xlm,
                            eth: _eth,
                            userAddress,
                            secret,
                        });
                        const _id = responce._id;
                        await Balance.create({
                            '_id.orioAddress': userAddress,
                            '_id.source': 'SENDWYRE',
                            balance: 0,
                        });
                        jwtManagement.createSendJwtToken(responce, STATUS_CODE.OK, req, res);
                    } catch (e) {
                        return next(new AppError(e, STATUS_CODE.BAD_REQUEST));
                    }
                };
                dataIntoDataBase();
            }
        );
    });
});

exports.updateAddress = catchAsync(async (req, res, next) => {
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
    const { userId, publicKey } = req.body;
    if (!userId || !publicKey) {
        return next(new AppError('Some parameter are missing', STATUS_CODE.BAD_REQUEST));
    }
    const _id = userId;
    const result = await ObyteUser.findById(_id);
    if (!result) {
        return next(new AppError('User Address not found', STATUS_CODE.BAD_REQUEST));
    }
    exec(
        `python ${process.env.PYTHON_FILE_PATH} '${result.userAddress}' '${publicKey}'`,
        (error, encrypted, stderr) => {
            if (error) {
                console.log(error);
                return next(new AppError(`${error.message}`, STATUS_CODE.BAD_REQUEST));
            }
            if (stderr) {
                console.log(stderr);
                return next(new AppError(`${stderr}`, STATUS_CODE.BAD_REQUEST));
            }
            asyncFunction = async () => {
                await ObyteUser.findOneAndUpdate({ _id }, { $set: { encrypted } });
                res.status(STATUS_CODE.OK).json({
                    status: STATUS.SUCCESS,
                    message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
                    result: encrypted,
                });
            };
            asyncFunction();
        }
    );
});

exports.adminPublicKey = catchAsync(async (req, res) => {
    const PUBLIC_KEY = process.env.ADMIN_PUBLIC_KEY;
    const BTC_ADDRESS = process.env.ADMIN_BTC_ADDRESS;
    const LTC_ADDRESS = process.env.ADMIN_LTC_ADDRESS;
    const BCH_ADDRESS = process.env.ADMIN_BCH_ADDRESS;
    const ETH_ADDRESS = process.env.ADMIN_ETH_ADDRESS;
    if (
        !PUBLIC_KEY ||
        PUBLIC_KEY === undefined ||
        PUBLIC_KEY === '' ||
        !BTC_ADDRESS ||
        BTC_ADDRESS === undefined ||
        BTC_ADDRESS === '' ||
        !LTC_ADDRESS ||
        LTC_ADDRESS === undefined ||
        LTC_ADDRESS === '' ||
        !BCH_ADDRESS ||
        BCH_ADDRESS === undefined ||
        BCH_ADDRESS === '' ||
        !ETH_ADDRESS ||
        ETH_ADDRESS === undefined ||
        ETH_ADDRESS === ''
    ) {
        return next(new AppError(`Some values are missing`, STATUS_CODE.BAD_REQUEST));
        //throw new Error('Some values are missing');
    }
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        result: { PUBLIC_KEY, BTC_ADDRESS, ETH_ADDRESS, LTC_ADDRESS, BCH_ADDRESS },
    });
});

exports.userInfo = catchAsync(async (req, res, next) => {
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
    const { _id } = req.body;
    const user = await ObyteUser.findById(_id);
    if (user === null) {
        return next(new AppError(`User not found with this id`, STATUS_CODE.NOT_FOUND));
    }
    jwtManagement.createSendJwtToken(user, STATUS_CODE.OK, req, res);
});

exports.countryInfo = catchAsync(async (req, res, next) => {
    const { countryName } = req.body;
    if (!countryName || countryName.length === 0 || countryName === '') {
        return next(new AppError(`Country name is not valid`, STATUS_CODE.BAD_REQUEST));
    }
    let desireCountry;
    for (let country in countries) {
        if (countries[country].country.name === countryName) {
            desireCountry = countries[country];
            break;
        }
    }
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        message: SUCCESS_MSG.SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
        result: {
            countryName: desireCountry.country.name,
            countryCode: desireCountry.country.code,
            dialCode: desireCountry.country.dial_code,
            currencyCode: desireCountry.code,
            countryMask: desireCountry.mask,
        },
    });
});

exports.currentUser = catchAsync(async (req, res, next) => {
    const user = await ObyteUser.findOne({ _id: req.user._id });
    if (user === null) {
        return next(new AppError(`User not found with this id`, STATUS_CODE.NOT_FOUND));
    }
    res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: user,
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { userName } = req.body;
    const user = await ObyteUser.findOne({ userName: userName });
    if (user === null) {
        return next(new AppError(`User not found with this id`, STATUS_CODE.NOT_FOUND));
    }
    jwtManagement.createSendJwtToken(user, STATUS_CODE.OK, req, res);
});
