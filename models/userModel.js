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
    mobile :{
      type: String,
      required:true
    },
    dateofbirth:{
      type: Date,
      required:true
      
    },
    gender:{
      type:String,
      required:true
    },
    password :{
      type: String,
      required:true
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
    
});

const User = mongoose.model("User", userScchema);
module.exports = User;