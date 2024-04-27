const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const categorySchima = mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },offer:{
        type:ObjectId
    },isDeleted: {
        type: Boolean,
        default: false
    }
});


const Category = mongoose.model("Category", categorySchima);
module.exports = Category;