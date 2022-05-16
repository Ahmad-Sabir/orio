const mongoose = require('mongoose')
// const WyreWallet = new mongoose.Schema({ 
        // WyreWallet
// });
const obyteUser = new mongoose.Schema({
    encryptedKey:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userAddress: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }, 
    btc: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    avax: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }, 
    xlm: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }, 
    eth: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    secret: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // apiKey: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     trim: true
    // },
    // secretKey: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     trim: true
    // }
},
{ 
    timestamps: true 
});

const ObyteUser = mongoose.model('ObyteUser', obyteUser )

module.exports = ObyteUser