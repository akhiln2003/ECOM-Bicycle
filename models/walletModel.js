const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const transactionSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Credit', 'Debit'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    orderId: {
        type:ObjectId,
        ref: 'Order'
    },
    orderId2: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});






const walletSchema = mongoose.Schema({

    userId:{
        type:ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    },
    walletHistory: [transactionSchema]
});

module.exports = mongoose.model('Wallet',walletSchema);

