const Balance = require('../models/Balance');
const OrioPrice = require('../models/OrioPrices');
const ObyteUser = require('../models/ObyteUser');
const Bid = require('../models/bidModel');
const Nft = require('../models/nftModel');
const axios = require('axios');
const getHashed = require('./getTxId');
const SellAndBuyOrio = require('../models/SellAndBuyOrio');
const priceFormula = require('./priceFormula');

const sendToAdmin = async (walletId, orioNetworkFee, token) => {
    try {
        let { data } = await axios.post(
            process.env.TRANSFER_API_V3,
            {
                autoConfirm: true,
                source: `wallet:${walletId}`,
                sourceCurrency: 'PAX',
                sourceAmount: `${orioNetworkFee}`,
                destCurrency: 'PAX',
                dest: `${process.env.ADMIN_ETH_ADDRESS}`, // Send to the Admin
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
        return data;
    } catch (e) {
        return e;
    }
};

const transaction = async () => {
    const transactions = await SellAndBuyOrio.find({
        action: 'SELL',
        status: { $ne: 'COMPLETED' },
    });
    console.log(transactions);
    for (let i = 0; i < transactions.length; i++) {
        let data = await axios.get(
            `https://api.testwyre.com/v3/transfers/${transactions[i].txId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.MAIN_NET_TOKEN}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(data);
        if (transactions[i].action === 'SELL' && data.data.status === 'COMPLETED') {
            const user = await ObyteUser.findOne({ userAddress: transactions[i].orioAddress });
            //Transfer Orio Network Fee in crypto to Admin
            try {
                const returnTransferToAdmin = await sendToAdmin(
                    user.id,
                    transactions[i].orioNetworkFee * transactions[i].orioPrice,
                    process.env.MAIN_NET_TOKEN
                );
                console.log(returnTransferToAdmin);
                if (!returnTransferToAdmin) {
                    continue;
                }
                await SellAndBuyOrio.findByIdAndUpdate(
                    transactions[i]._id,
                    { status: data.data.status },
                    { new: true }
                );
                await Balance.findOneAndUpdate(
                    { '_id.orioAddress': transactions[i].orioAddress },
                    { $inc: { balance: -transactions[i].orio } },
                    { new: true }
                );
                await priceFormula(transactions[i].orioNetworkFee, transactions[i].orio);
            } catch (e) {
                console.log(e);
                continue;
            }
        } else if (transactions[i].action === 'SELL' && data.data.status === 'FAILED') {
            const user = await ObyteUser.findOne({ userAddress: transactions[i].orioAddress });
            //Transfer Orio Network Fee in crypto to Admin
            try {
                await SellAndBuyOrio.findByIdAndUpdate(
                    transactions[i]._id,
                    { status: data.data.status },
                    { new: true }
                );
            } catch (e) {
                console.log(e);
                continue;
            }
        } else {
            continue;
        }
    }
};

module.exports = { transaction };
