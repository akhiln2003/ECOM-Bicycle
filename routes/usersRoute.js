const express = require('express');
const user_route = express();
const session = require('express-session');
require('dotenv').config()


user_route.use(session({secret: process.env.sessionSecret,resave:false,saveUninitialized:false}));

const auth = require('../middleware/userAuth');
const userController = require("../controller/userController");

user_route.use(express.json());
user_route.use(express.urlencoded({extended:true}));


    //  seting ejs view engin
user_route.set('view engine', 'ejs');
user_route.set('views','./views/users');


user_route.get('/',userController.loadHome);

user_route.get('/login',userController.loadLogin);
user_route.post('/login',auth.isLogin,userController.loadHome);

user_route.get('/otp',userController.loadOtp);
user_route.post('/otp',userController.verifyOtp);  

user_route.get('/register', userController.loadRegister);
user_route.post('/register',userController.insertuser);



user_route.get('/otp',userController.loadOtp);
user_route.post('/otp',userController.verifyOtp);




module.exports = user_route;