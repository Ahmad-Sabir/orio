const mongoose = require("mongoose");

const loginDetail = new mongoose.schema({
    userId:{
        type: String,
        required: true,
        trim: true,
        ref: "Users"
    },
    adId:{
        type: String,
        required: true,
        trim: true
    },
    location:{
        type: String,
        required: true,
        trim: true
    },
    deviceModel:{
        type: String,
        required: true,
        trim: true
    }
},{
    timestamps: true
});

const LoginDetail = mongoose.model('LoginDetail', loginDetail);
module.exports = LoginDetail