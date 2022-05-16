const Balance = require('../models/Balance');
const OrioPrice = require('../models/OrioPrices');
const ObyteUser = require('../models/ObyteUser');
const Bid = require('../models/bidModel');
const Nft = require('../models/nftModel');
const axios = require('axios');
const getHashed = require('./getTxId');
const SellAndBuyOrio = require('../models/SellAndBuyOrio');
const NftTransaction = require('../models/nftTransactionModel');
const checkBalance = async (req, price) => {
    const userAddress = req.user.userAddress;
    const balance = await Balance.findOne({ '_id.orioAddress': userAddress });
    return Number(balance.balance) > price;
};

const orioLatestPrice = async () => {
    let p = await OrioPrice.findOne().sort({
        createdAt: -1,
    });
    let orioCalculatedPrice;
    if (p) {
        orioCalculatedPrice = p.orioCalculatedPrice;
    } else {
        orioCalculatedPrice = 1;
    }
    return orioCalculatedPrice;
};

const updateBalance = async (amount, orioAddress, session) => {
    await Balance.findOneAndUpdate(
        { '_id.orioAddress': orioAddress },
        { $inc: { balance: amount } },
        { new: true, session: session }
    );
};

const cutFromHold = async (amount, BuyerAddress, session) => {
    await Balance.findOneAndUpdate(
        { '_id.orioAddress': BuyerAddress },
        { $inc: { onHold: -amount } },
        { new: true, session: session }
    );
};

const balanceToOnHold = async (bidAmount, orioAddress, session) => {
    await Balance.findOneAndUpdate(
        { '_id.orioAddress': orioAddress },
        { $inc: { balance: -bidAmount } },
        { new: true, session: session }
    );
    await Balance.findOneAndUpdate(
        { '_id.orioAddress': orioAddress },
        { $inc: { onHold: bidAmount } },
        { new: true, session: session }
    );
};
const onHoldToBalance = async (nft, session) => {
    const bids = await Bid.find({ nft: nft }).sort({ createdAt: -1 }).populate('bider');
    if (bids.length > 0) {
        console.log('hererererererere');
        console.log(bids[0].bider.userAddress, bids[0].bidPrice);
        await Balance.findOneAndUpdate(
            { '_id.orioAddress': bids[0].bider.userAddress },
            { $inc: { balance: bids[0].bidPrice } },
            { new: true, session: session }
        );
        await Balance.findOneAndUpdate(
            { '_id.orioAddress': bids[0].bider.userAddress },
            { $inc: { onHold: -bids[0].bidPrice } },
            { new: true, session: session }
        );
    }
};

const bidCheck = async (bidAmount, nft) => {
    const bids = await Bid.find({ nft: nft }).sort({ createdAt: -1 });
    if (bids.length <= 0) {
        return true;
    }
    return bidAmount > bids[0].bidPrice;
};

const ownership = async (nft, currentOwner, previousOwner, session) => {
    console.log(nft, currentOwner, previousOwner);
    await Nft.findByIdAndUpdate(
        nft,
        {
            owner: currentOwner,
            $push: { previousOwners: previousOwner },
        },
        { new: true, session: session }
    );
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

const refundToUser = async (data) => {
    let src = data.source;
    let source = src.split(':');
    let des = data.dest;
    let dest = des.split(':');
    const sourceUser = await ObyteUser.findOne({ eth: dest[1] });
    const destUser = await ObyteUser.findOne({ id: source[1] });
    await axios.post(
        process.env.TRANSFER_API_V3,
        {
            autoConfirm: true,
            source: `wallet:${sourceUser.id}`,
            sourceCurrency: 'PAX',
            sourceAmount: `${data.destAmount}`,
            destCurrency: `PAX`,
            dest: `account:${destUser.eth}`, // Send to the USER
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.MAIN_NET_TOKEN}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
};
const refundFromAdmin = async (data) => {
    let src = data.source;
    let source = src.split(':');
    const destUser = await ObyteUser.findOne({ id: source[1] });
    await axios.post(
        process.env.TRANSFER_API_V3,
        {
            autoConfirm: true,
            source: `wallet:${process.env.ADMIN_DEST_ADDRESS}`,
            sourceCurrency: 'PAX',
            sourceAmount: `${data.destAmount}`,
            destCurrency: `PAX`,
            dest: `account:${destUser.eth}`, // Send to the USER
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.MAIN_NET_TOKEN}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
};

const auctionExpire = async (token) => {
    console.log(token);
    const nft = await Nft.find({ auctionExpireTime: { $lte: new Date() } }).populate(
        'owner creator'
    );
    console.log(nft);
    if (nft.length > 0) {
        //console.log(nft);
        const session = await Nft.startSession();
        for (var i = 0; i < nft.length; i++) {
            console.log('hello');
            const bids = await Bid.find({ nft: nft[i]._id })
                .sort({ createdAt: -1 })
                .populate('bider');
            //console.log(bids);
            await session.withTransaction(async () => {
                if (bids.length > 0) {
                    console.log(bids);
                    const orioLatest = await orioLatestPrice();
                    let orioNetworkFee = Number(bids[0].bidPrice) * 0.01;
                    let sourceAmount = Number(bids[0].bidPrice) - orioNetworkFee;
                    let royaltyAmount;
                    let royaltyAmountPx;

                    console.log(nft[i].owner._id, nft[i].creator._id);
                    if (
                        !nft[i].creator._id.equals(nft[i].owner._id) &&
                        !nft[i].creator._id.equals(bids[0].bider._id)
                    ) {
                        royaltyAmount = sourceAmount * (nft[i].royaltyBonus / 100);
                        sourceAmount = sourceAmount - royaltyAmount;
                        royaltyAmountPx = royaltyAmount * orioLatest;
                    }
                    sourceAmount = Number(sourceAmount) * orioLatest;
                    let orioNetPax = orioNetworkFee * orioLatest;
                    //console.log(orioNetworkFee, sourceAmount);
                    //console.log(bids[0].bider);
                    // transfer to user
                    let returnTransferToUser;
                    try {
                        returnTransferToUser = await axios.post(
                            process.env.TRANSFER_API_V3,
                            {
                                autoConfirm: true,
                                source: `wallet:${bids[0].bider.id}`,
                                sourceCurrency: 'PAX',
                                sourceAmount: `${sourceAmount}`,
                                destCurrency: `PAX`,
                                dest: `${nft[i].owner.eth}`, // Send to the USER
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
                        return;
                    }
                    if (returnTransferToUser.data.status === 'FAILED') {
                        console.log('hello');
                        return;
                    }
                    let body = {
                        autoConfirm: true,
                        source: `wallet:${bids[0].bider.id}`,
                        sourceCurrency: `PAX`,
                        sourceAmount: `${orioNetPax}`,
                        destCurrency: 'PAX',
                        dest: `${process.env.ADMIN_ETH_ADDRESS}`, // AC_QRJWR69HM6G
                    };
                    let resu;
                    try {
                        resu = await axios.post(process.env.TRANSFER_API_V3, body, {
                            headers: {
                                Authorization: `Bearer ${process.env.MAIN_NET_TOKEN}`,
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                        });
                    } catch (e) {
                        refundToUser(resu.data);
                        return;
                    }
                    if (resu.data.status === 'FAILED') {
                        refundToUser(resu.data);
                        return;
                    }
                    //console.log(nft[i].owner.id);
                    //console.log(resu);
                    if (
                        !nft[i].creator._id.equals(nft[i].owner._id) &&
                        !nft[i].creator._id.equals(bids[0].bider._id)
                    ) {
                        let royality;
                        try {
                            royality = await axios.post(
                                process.env.TRANSFER_API_V3,
                                {
                                    autoConfirm: true,
                                    source: `wallet:${bids[0].bider.id}`,
                                    sourceCurrency: 'PAX',
                                    sourceAmount: `${royaltyAmountPx}`,
                                    destCurrency: `PAX`,
                                    dest: `${nft[i].creator.eth}`, // Send to the USER
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
                            refundToUser(returnTransferToUser.data);
                            refundFromAdmin(resu.data);
                            return;
                        }
                        if (royality.data.status === 'FAILED') {
                            refundToUser(returnTransferToUser.data);
                            refundFromAdmin(resu.data);
                            return;
                        }
                    }
                    console.log('here');
                    let orioTxId = getHashed();
                    let { fees } = returnTransferToUser.data;
                    const txFee = Object.entries(fees).length === 0 ? 0 : Object.values(fees)[0];
                    if (!royaltyAmount) {
                        royaltyAmount = 0;
                    }
                    let sourceOrio;
                    if (txFee === 0) {
                        sourceOrio = sourceAmount / orioLatest + orioNetworkFee + royaltyAmount;
                    } else {
                        sourceOrio =
                            sourceAmount / orioLatest +
                            txFee / orioLatest +
                            orioNetworkFee +
                            royaltyAmount;
                    }
                    this.transcation = await SellAndBuyOrio.create(
                        [
                            {
                                previousOwner: nft[i].owner._id,
                                currentOwner: bids[0].bider._id,
                                nft: nft[i]._id,
                                status: 'COMPLETED',
                                txId: returnTransferToUser.data.id,
                                orioAddress: bids[0].bider.userAddress,
                                orioTxId,
                                sourceCurrency: 'PAX',
                                sourceAmount: returnTransferToUser.data.sourceAmount,
                                destCurrency: returnTransferToUser.data.destCurrency,
                                destAmount: returnTransferToUser.data.destAmount,
                                orio: sourceOrio,
                                orioNetworkFee: orioNetworkFee,
                                txFee,
                                orioPrice: orioLatest,
                                roalityBonusOrio: royaltyAmount,
                                action: 'NFT',
                                dcp: 'SENDWYRE',
                            },
                        ],
                        { session: session }
                    );
                    console.log(this.transaction);
                    await cutFromHold(bids[0].bidPrice, bids[0].bider.userAddress, session);
                    await updateBalance(
                        returnTransferToUser.data.destAmount / orioLatest,
                        nft[i].owner.userAddress,
                        session
                    );
                    if (!nft[i].creator._id.equals(nft[i].owner._id)) {
                        await updateBalance(royaltyAmount, nft[i].creator.userAddress, session);
                    }
                    await ownership(
                        this.transcation[0].nft,
                        this.transcation[0].currentOwner,
                        this.transcation[0].previousOwner,
                        session
                    );
                    await Bid.deleteMany({ nft: nft[i]._id });
                    await Nft.findByIdAndUpdate(
                        nft[i],
                        { selling: false, auctionExpireTime: undefined },
                        { new: true, session: session }
                    );
                } else {
                    await Nft.findByIdAndUpdate(
                        nft[i],
                        { selling: false, auctionExpireTime: undefined },
                        { new: true, session: session }
                    );
                }
            });
            session.endSession();
        }
    }
};

module.exports = {
    filterObj,
    checkBalance,
    orioLatestPrice,
    updateBalance,
    balanceToOnHold,
    onHoldToBalance,
    bidCheck,
    ownership,
    auctionExpire,
    refundToUser,
    refundFromAdmin,
};
