const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    require: true
  },
  productPrice: {
    type: Number,
    require: true
  },

  description: {
    type: String,
    require: true
  },
  category: {
    type: ObjectId,
    ref: 'Category',
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },

  // brand:{
  //     type: ObjectId,
  //     ref:'Brand',
  //     required:true
  // },
  // offer:{
  //     type:String,
  //     require:true
  // },
  image: {
    type: Array,
    validate: [arrayLimit, "you can pass only 4 images"]
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: true
  }, offer: {
    type: ObjectId,
    ref: 'Offer'
  }


});

function arrayLimit(value) {
  return value.length <= 4
}

const products = mongoose.model('Product', productSchema);

module.exports = products;

