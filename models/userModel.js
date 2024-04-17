const mongoose = require('mongoose');



const userScchema = mongoose.Schema({
    name :{
        type : String,
        required:true   
    },
    email:{
      type : String,
      required:true
    },
    password :{
      type: String,
      required:false
    },
    dateJoined: {
      type: Date,
      default: Date.now
    },
    is_admin :{
      type : Number,
      default:0
    },
    blocked :{
      type:Boolean,
      default:false
    },
    verified :{
      type : Boolean,
      default:false
    },
    address:[
      {
        name:{
          type:String
        },
        state:{
          type:String
        },
        city:{
          type:String
        },
        pin:{
          type:Number
        },
        phone:{
          type:Number
        }
      }
    ]
    
});

const User = mongoose.model("User", userScchema);
module.exports = User;