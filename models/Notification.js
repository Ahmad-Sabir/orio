const mongoose = require('mongoose')

const notification = new mongoose.Schema({
    txId:{
        type: String,
        required: true,
        ref: "VerifyTransaction"
    },
    orioAddress: {
        type: String,
        required: true
    },
    orioAmount: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    action: {
        type: String,
        enum : ['SELL', 'BUY'],
        required: true
    }
},
{ 
    timestamps: true 
});

const Notification = mongoose.model('Notification', notification )

module.exports = Notification