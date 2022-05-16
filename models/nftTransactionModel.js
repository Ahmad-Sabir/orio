const mongoose = require('mongoose');

const nftTranscation = new mongoose.Schema(
    {
        previousOwner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        currentOwner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        nft: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'NFT id is required'],
        },
        soldAtPrice: {
            type: Number,
            required: [true, 'price is required'],
        },
    },
    {
        timestamps: true,
    }
);

const Transcation = mongoose.model('nftTransaction', nftTranscation);

module.exports = Transcation;
