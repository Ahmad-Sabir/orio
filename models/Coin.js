const mongoose = require('mongoose')
const orioCoins = new mongoose.Schema({
    coinsGenerated:{
        type: String,
    },
    coinsBurn: {
        type: String,
    },
    source: {
        type: String,
        required: true,
        unique: true
    },
},
{ 
    timestamps: true 
});

const OrioCoin  = mongoose.model('OrioCoin', orioCoins )

module.exports = OrioCoin