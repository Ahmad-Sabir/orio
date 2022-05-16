const mongoose = require('mongoose');

const currencies = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'title is required'],
        },
        iso_code: {
            type: String,
            unique: true,
            required: [true, 'iso_code is required'],
        },
        icon: {
            type: String,
            required: [true, 'icon is required'],
        },
        symbol: {
            type: String,
            required: [true, 'symbol is required'],
        },
    },
    {
        timestamps: true,
    }
);

const Currency = mongoose.model('currencies', currencies);
module.exports = Currency;
