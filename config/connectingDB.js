 const mongoose = require('mongoose');
 
 module.exports ={
   connectDB : (()=>{
      mongoose.connect(process.env.MONGO_URL,{

      }).then(()=>{
         console.log("connect to Database");
      }).catch((error)=>{
         console.log(error);
      })
   })
 }

