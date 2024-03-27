const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const wishListSchema = mongoose.Schema({
    userId:{
        type:ObjectId,
        ref:'User',
        required:true
    },
    productId:{
        type:ObjectId,
        ref:'Product',
        required:true
    }
});

module.exports = mongoose.model('WishList',wishListSchema);