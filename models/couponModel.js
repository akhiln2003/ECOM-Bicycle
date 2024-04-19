const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const couponSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    couponCod: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    }, type: {
        type: String,
        require: true
    }, minSpend: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    user: [{
        userId: {
            type: ObjectId,
            ref: 'User',
        }

    }],
    isDeleted: {
        type: Boolean,
        default: false,
        required: true
    }
})


module.exports = mongoose.model('Coupon', couponSchema);