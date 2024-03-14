const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new  mongoose.Schema({
        userId:{
            type:ObjectId,
            ref:'User',
            required:true
        },
        products:[{
            productId : {
                type:ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                default:1
            },
            pice:{
                type:Number,
                required:true
            },
            totalPrice:{
                type:Number,
                required:true
            }
        }
        ]
})


module.exports = mongoose.model('Cart',cartSchema);
