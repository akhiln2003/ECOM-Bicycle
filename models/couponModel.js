 const mongoose = require('mongoose');

 const couponSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    couponCod:{
        type:String,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true
    },minSpend:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    isDeleted:{
        type :Boolean,
        default:false,
        required:true
    }
 })


 module.exports = mongoose.model('Coupon',couponSchema);