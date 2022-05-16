const mongoose = require('mongoose')
const sellOrio = new mongoose.Schema({
    orioAddress: {
        type: String,
        required: true,
        ref: 'User'
    }, 
    userHandler: {
        type: String,
        required: true
    },
    dcp: {
        type: String,
        required: true
    },
    selectedCurrency: {
        type: String,
        enum: ['BTC', 'ETH', 'LTC', 'BCH'],
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRM', 'REJECTED'],
        default: "PENDING"
    },
    publicKey: {
        type: String,
        required: true
    },
    orioAmount: {
        type: String,
        required: true
    },
    amountInSelectedCurrency: {
        type: String,
        required: true
    },
    orioNetworkFee: {
        type: String,
        required: true
    },
    memo: {
        type: String,
        required: true
    },
},
{ 
    timestamps: true 
});

const SellOrio = mongoose.model('SellOrio', sellOrio)
module.exports = SellOrio; 