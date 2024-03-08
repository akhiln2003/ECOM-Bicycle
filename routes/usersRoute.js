const express = require('express');
const user_route = express();
const session = require('express-session');
require('dotenv').config();

const auth = require('../middleware/userAuth');
const userController = require("../controller/userController");
const shopController =  require('../controller/shopController');
const  profileController =  require('../controller/userProfilecontroller');

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
user_route.get('/logout',userController.logOut);

             //Otp Page
user_route.get('/otp',userController.loadOtp);
user_route.post('/otp',userController.verifyOtp);  

             //Register Page
user_route.get('/register', userController.loadRegister);
user_route.post('/register',userController.insertuser);


            //  Shop Page
user_route.get('/shop',shopController.loadShop);
user_route.get('/productDetails',shopController.loadProductDetails);   


            // Profile page
user_route.get('/profile',auth.isLogOut,profileController.loadProfile);
user_route.get('/address',auth.isLogOut,profileController.loadAddress);
user_route.get('/editProfile',auth.isLogOut,profileController.loadEditprofile);
user_route.post('/editProfile',auth.isLogOut,profileController.updateProfile);
user_route.get('/changePassword',auth.isLogOut,profileController.loadChangepassword);
user_route.post('/changePassword',auth.isLogOut,profileController.changePassword);
user_route.get('/addAddress',auth.isLogOut,profileController.loadAddaddress);
user_route.post('/addAddress',auth.isLogOut,profileController.insertAddress);
user_route.get('/editAddress',auth.isLogOut,profileController.loadEditaddress);
user_route.post('/editAddress',auth.isLogOut,profileController.updatEditaddress);
user_route.post('/deletAddress',auth.isLogOut,profileController.deletAddress);







module.exports = user_route;