 const mongoose = require('mongoose');
 
 module.exports ={
   connectDB : (()=>{
      mongoose.connect('mongodb://127.0.0.1:27017/ECOM_BICYCLE',{

      }).then(()=>{
         console.log("connect to Database");
      }).catch((error)=>{
         console.log(error);
      })
   })
 }

