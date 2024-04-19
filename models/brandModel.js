const mongoose = require('mongoose');

const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    brandLogo: {
        type: String,
        required: true
    }
});

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;