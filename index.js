const connectdb = require('./config/connectingDB');
connectdb.connectDB();

const express = require('express');
const path = require('path');
const app = express();


const flash = require('express-flash');
app.use(flash());

app.set('view engine', 'ejs')

app.use(express.json());




app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/assets')));



// app.use(express.static(path.join(__dirname,'public/uploads')));

 //For user rout
const userRout = require('./routes/usersRoute');
app.use('/',userRout);


const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute)



app.listen(3000,()=>{
    console.log("http://localhost:3000");
});