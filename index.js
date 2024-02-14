
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
app.set('view engine', 'ejs')

app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/ECOM_BICYCLE');

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/assets')));


// app.use(express.static(path.join(__dirname,'public/uploads')));

 //For user rout
const userRout = require('./routes/usersRoute');
app.use('/',userRout);



app.listen(3000,()=>{
    console.log("http://localhost:3000");
});