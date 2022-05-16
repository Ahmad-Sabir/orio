const mongoose = require('mongoose')
const verifyTransaction = new mongoose.Schema({
    txId: {
        type: String,
        required: true,
        unique: true
    },
    userOrioAddress: {
        type: String,
        required: true,
    },
    // userPublicAddress: {
    //     type: String,
    //     required: true
    // },
    burntOrioAmount: {
        type: Number,
    },
    amount: {
        type: Number,
    },
    currency: {
        type: String,
        require: true,
        enum: ['BTC', 'BCH', 'LTC', 'ETH']
    },
    status: {
        type: String,
        required: true,
        enum: ['PENDING', 'CONFIRM'],
        default: 'PENDING'
    }
},
{ 
    timestamps: true 
});

const VerifyTransaction = mongoose.model('VerifyTransaction', verifyTransaction )

module.exports = VerifyTransaction 