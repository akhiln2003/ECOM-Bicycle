const connectdb = require('./config/connectingDB');
const userRout = require('./routes/usersRoute');
const express = require('express');
connectdb.connectDB();

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
app.use('/',userRout);


const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute)



app.listen(3000,()=>{
    console.log("http://localhost:3000");
});