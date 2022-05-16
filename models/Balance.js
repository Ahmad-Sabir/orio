const mongoose = require('mongoose');
const orioBalance = new mongoose.Schema(
    {
        _id: {
            orioAddress: {
                type: String,
                ref: 'User',
                required: true,
            },
            source: {
                type: String,
                enum: ['DCP1', 'DCP2', 'SENDWYRE'],
                required: true,
            },
        },
        balance: {
            type: Number,
            required: true,
        },
        onHold: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Balance = mongoose.model('Balance', orioBalance);

module.exports = Balance;
