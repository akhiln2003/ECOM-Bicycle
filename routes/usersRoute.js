const express = require('express');
const user_route = express();
const session = require('express-session');
require('dotenv').config();

const auth = require('../middleware/userAuth');
const userController = require("../controller/userController");
const shopController =  require('../controller/shopController');

user_route.use(session({secret: process.env.sessionSecret,resave:false,saveUninitialized:false}));
user_route.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.LoggedIn = req.session.user ? true : false;
    next()
  })



user_route.use(express.json());
user_route.use(express.urlencoded({extended:true}));


       //  seting ejs view engin
user_route.set('view engine', 'ejs');
user_route.set('views','./views/users');

            // Home paage
user_route.get('/',userController.loadHome);

           // Login Page
user_route.get('/login',userController.loadLogin);
user_route.post('/login',userController.verifyLogin);

             //Otp Page
user_route.get('/otp',userController.loadOtp);
user_route.post('/otp',userController.verifyOtp);  

             //Register Page
user_route.get('/register', userController.loadRegister);
user_route.post('/register',userController.insertuser);


            //  Shop Page
user_route.get('/shop',shopController.loadShop);
user_route.get('/productDetails',shopController.loadProductDetails);            






module.exports = user_route;