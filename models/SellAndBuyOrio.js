const mongoose = require('mongoose');
const sellAndBuyOrio = new mongoose.Schema(
    {
        previousOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ObyteUser',
        },
        currentOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ObyteUser',
        },
        nft: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'nft',
        },
        txId: {
            type: String,
            unique: true,
            required: true,
        },
        orioAddress: {
            type: String,
            required: true,
        },
        orioTxId: {
            type: String,
            unique: true,
            required: true,
        },
        sourceCurrency: {
            type: String,
        },
        sourceAmount: {
            type: Number,
            required: true,
        },
        destCurrency: {
            type: String,
        },
        destAmount: {
            type: Number,
            required: true,
        },
        orio: {
            type: Number,
            required: true,
        },
        orioNetworkFee: {
            type: Number,
            required: true,
        },
        txFee: {
            type: Number,
            required: true,
        },
        action: {
            type: String,
            enum: ['SELL', 'BUY', 'NFT'],
            required: true,
        },
        dcp: {
            type: String,
            enum: ['DCP1', 'DCP2', 'SENDWYRE'],
            required: true,
        },
        status: {
            type: String,
            enum: ['PENDING', 'CONFIRM', 'COMPLETED', 'FAILED', 'UNCONFIRMED'],
            default: 'PENDING',
        },
        orioPrice: {
            type: Number,
            required: true,
        },
        roalityBonusOrio: {
            type: Number,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const SellAndBuyOrio = mongoose.model('SellAndBuyOrio', sellAndBuyOrio);

module.exports = SellAndBuyOrio;
