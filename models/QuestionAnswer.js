const mongoose = require("mongoose");

const questionAnswer = new mongoose.model({
    question:{
        type: String,
        required: true,
        trim: true
    },
    answers:{
        _id: mongoose.Types.ObjectId(),
        userId:{
            type: String,
            required: true,
            trim: true,
            ref: "Users"
        },
        answer:{
            type: String,
            required: true,
            trim: true
        }
    }
});

const QuestionAnswer = mongoose.model("QuestionAnswer", questionAnswer);

module.exports = QuestionAnswer;