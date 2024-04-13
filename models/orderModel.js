const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;  

const orderSchima = mongoose.Schema({
    
    userId:{
        type:ObjectId,
        ref:'User',
        required:true
    },
    orderId:{
        type:String,
        required:true
      },
    products:[
        {
            productId:{
                type:ObjectId,
                ref:'Product',
                required:true
            },
            name:{
                type:String
            },
            price:{
                type:Number
            },
            description:{
                type:String
            },
            status:{
                type:String,
                enum:['placed','pending','outForDelivery','returnRequested','returned','returnDenied','shipped','delivered','cancelled',],
                default:'pending'
            },
            quantity:{
                type:Number
            },
            returnReason:{
                type:String
            },
            cancelReason:{
                type:String
            },
        }
    ],
    
    returnReason:{
        type:String
    },
    totalAmount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    deliveryAddress:{
        type:Object,
        required:true
    } ,
    couponUsed:{
        type:ObjectId,
        ref:'Coupon'
    }  
});


module.exports =  mongoose.model('Order',orderSchima);
