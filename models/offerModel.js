const mongoose = require('mongoose');

const offerSchima = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    offerPercentage: {
        type: Number,
        required: true
    },
    expiryDate:{
        type: Date,
        required:true
    },
    isDeleted: {
       type:Boolean,
       default:false

    }
});


const offer = mongoose.model("Offer", offerSchima);
module.exports = offer;
