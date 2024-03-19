const connectdb = require('./config/connectingDB');
const userRout = require('./routes/usersRoute');
const express = require('express');
const nocache = require('nocache');
const flash = require('express-flash');
const path = require('path');
const app = express();

connectdb.connectDB();

app.set('view engine', 'ejs')

app.use(express.json());
app.use(nocache());
app.use(flash());




app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/assets')));



// app.use(express.static(path.join(__dirname,'public/uploads')));

 //For user rout
app.use('/',userRout);


const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute)



app.listen(3000,()=>{
    console.log("http://localhost:3000");
});