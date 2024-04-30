const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }
    ],
    couponApplyd: {
        couponId: {
            type: ObjectId,
            ref:'Coupon'
        },
        couponDiscount: {
            type: Number
        }
    }
})


module.exports = mongoose.model('Cart', cartSchema);
