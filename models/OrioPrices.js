const mongoose = require('mongoose');
const orioPrices = new mongoose.Schema(
    {
        orioPrice: {
            type: Number,
            required: true,
        },
        numberOfOrio: {
            type: Number,
            required: true,
        },
        orioCalculatedPrice: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const OrioPrices = mongoose.model('OrioPrices', orioPrices);
module.exports = OrioPrices;
