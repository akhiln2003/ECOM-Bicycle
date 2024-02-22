const mongoose = require('mongoose');

const userOTPVerificationSchema = mongoose.Schema({
    email:{
        type:String
    },
    otp:{
        type:String
    },
    createdAt :{
        type: Date,
        default: Date.now
      }
      
});

userOTPVerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const userVerification = mongoose.model('userOTPVerification',userOTPVerificationSchema);

module.exports = userVerification;