const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const walletSchema = mongoose.Schema({

    userId:{
        type:ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    } 
});

module.exports = mongoose.model('Wallet',walletSchema);

