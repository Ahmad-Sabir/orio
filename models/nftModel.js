const mongoose = require('mongoose');

const nftModel = new mongoose.Schema(
    {
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ObyteUser',
            required: [true, 'creator is required'],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ObyteUser',
            required: [true, 'owner is required'],
        },
        previousOwners: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ObyteUser',
            },
        ],
        title: {
            type: String,
            required: [true, 'title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'description is required'],
            trim: true,
        },
        categories: {
            type: String,
            enum: {
                values: ['Art', 'Collectible', 'Games', 'Metaverse', 'Other', 'Utility'],
                message: 'Categories Must be Art, Collectible, Games, Metaverse, Utility or Other',
            },
            required: [true, 'category is required'],
        },
        file: {
            type: String,
            required: [true, 'file is required'],
        },
        fileType: {
            type: String,
            required: [true, 'fileType is required'],
        },
        fileHash: {
            type: String,
            unique: true,
        },
        typeOfSale: {
            type: String,
            enum: {
                values: ['Bid', 'FixedPrice'],
                message: 'typeOfSale Must be Bid or fixedPrice ',
            },
            //required: [true, 'type of sale is required'],
        },
        price: {
            type: Number,
            required: [true, 'price is required'],
            trim: true,
        },
        minPrice: {
            type: Number,
            required: [true, 'Minimum Price is required'],
            trim: true,
        },
        royaltyBonus: {
            type: Number,
        },
        auctionExpireTime: {
            type: Date,
        },
        selling: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

nftModel.virtual('bids', {
    ref: 'bid',
    localField: '_id',
    foreignField: 'nft',
});

const Nft = mongoose.model('nft', nftModel);

module.exports = Nft;
