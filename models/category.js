const mongoose = require('mongoose');

const categorySchima  = mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default : false
    }
});


const Category = mongoose.model("Category", categorySchima);
module.exports = Category;