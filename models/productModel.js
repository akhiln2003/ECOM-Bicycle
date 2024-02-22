const mongoose =require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

  const productSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    previousPrice:{
        type:Number,
        require:true
    },
    discription:{
        type:String,
        require:true
    },
    category:{
        type: ObjectId,
        ref:'Category',
        required:true
    },
    brand:{
        type: ObjectId,
        ref:'Brand',
        required:true
    },
    offer:{
        type:String,
        require:true
    },
    image:{
        type:Array,
        validate:[arrayLimit,"you can pass only 4 images"]
    },
    is_Listed :{
        type :Boolean,
        default:false,
        required:true
      },
      stock :{
        type:Number,
        required:true
      }
      
    
  });

function arrayLimit(value){
   return value.length <=4
      }
    
const products = mongoose.model('product',productSchema);

module.exports = products;

