// var mongoose = require('mongoose'),
//     Schema = mongoose.Schema,
//     bcrypt = require('bcrypt'),
//     validator = require('validator'),
//     SALT_WORK_FACTOR = 10;


// const user = new Schema({ 
//     email:{
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         unique: true, 
//         validate:{
//             validator: validator.isEmail,
//             message: '{VALUE} is not a valid email',
//             isAsync: false
//         } 
//     },
//     password:{
//         type: String,
//         required: true,
//     },
//     mobileNumber:{
//         type: String,
//         required: true,
//         trim: true
//     },
//     walletId:{
//         type: String,
//         required: true,
//         trim: true
//     },
//     status:{
//         type: String,
//         enum: ["REGISTERED", "PENDING"],
//         default: "PENDING"
//     },
//     phrases:[
//         {
//             _id: Schema.Types.ObjectId,
//             phrase: {
//                 type: String,
//                 required: true,
//                 trim: true
//             }
//         }
//     ]
// },{ 
//     timestamps: true 
// });


// user.pre('save', function(next) {
//     var user = this;
//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified('password')) return next();

//     // generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//         if (err) return next(err);

//         // hash the password using our new salt
//         bcrypt.hash(user.password, salt, function(err, hash) {
//             if (err) return next(err);
//             // override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//         });
//     });
// });
     
// user.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };

// const User = mongoose.model('User', user)
// module.exports = User

////////////////////////////////////////
//          OLD USER TABLE
////////////////////////////////////////
const mongoose = require('mongoose');
const user = new mongoose.Schema({
    userHandler:{
        type: String,
        required: true
    },
    userOrioAddress:{
        type: String,
        required: true
    },
},{ 
    timestamps: true 
});

const User = mongoose.model('User', user)
module.exports = User