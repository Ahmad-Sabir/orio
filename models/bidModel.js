const mongoose = require('mongoose');

const bidModel = new mongoose.Schema(
    {
        nft: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'nft',
        },
        expireTime: {
            type: Date,
        },
        bider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ObyteUser',
        },
        bidPrice: {
            type: Number,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const Bid = mongoose.model('bid', bidModel);

module.exports = Bid;
