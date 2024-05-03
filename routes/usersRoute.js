
const express = require('express');
const session = require('express-session');
const auth = require('../middleware/userAuth');
const isBlocked = require('../middleware/checkUserIsBlock');
const { loadCartMiddleware } = require('../middleware/cartMiddleware');
const userController = require("../controller/userController");
const shopController = require('../controller/shopController');
const profileController = require('../controller/userProfilecontroller');
const cartController = require('../controller/cartController');
const checkoutController = require('../controller/checkoutController');
const ordreController = require('../controller/orderController');
const wishlistController = require('../controller/wishlistController');
const walletController = require('../controller/walletController');
const passport = require('passport');
const cookieSession = require('cookie-session')

const user_route = express();
require('dotenv').config();
require('../helpers/passportSetup');




user_route.use(session({ secret: process.env.sessionSecret, resave: false, saveUninitialized: false }));
user_route.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.LoggedIn = req.session.user ? true : false;
  next()
})



user_route.use(loadCartMiddleware)
user_route.use(express.json());
user_route.use(express.urlencoded({ extended: true }));

user_route.use(passport.initialize());
user_route.use(passport.session());


//  seting ejs view engin
user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');

// Home paage
user_route.get('/', userController.loadHome);

// Login Page
user_route.get('/login', userController.loadLogin);
user_route.post('/login', userController.verifyLogin);
user_route.get('/logout', userController.logOut);

user_route.get('/forgetPassword', userController.loadForgotPassword);
user_route.post('/forgetPassword', userController.forgotPassword);

user_route.get('/resetPassword/:id/:token', userController.loadResetPass);
user_route.post('/resetPassword', userController.resetPassword);

user_route.get('/loginWithGoogle', passport.authenticate('google', { scope: ['profile', 'email'] }));
user_route.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }), (req, res) => res.redirect('/success'));
user_route.get('/success', userController.googleLogin)

//Otp Page
user_route.get('/otp', userController.loadOtp);
user_route.post('/otp', userController.verifyOtp);

//Register Page
user_route.get('/register', userController.loadRegister);
user_route.post('/register', userController.insertuser);



//  Shop Page
user_route.get('/shop', shopController.loadShop);
user_route.post('/shop', shopController.loadShop);
user_route.get('/productDetails', shopController.loadProductDetails);
user_route.post('/searchproduct', shopController.searchProduct);

user_route.get('/about', userController.loadAboutas);
user_route.get('/contact', userController.loadContact);

// Profile page
user_route.get('/profile', auth.isLogOut,isBlocked, profileController.loadProfile);
user_route.get('/address', auth.isLogOut,isBlocked, profileController.loadAddress);
user_route.get('/editProfile', auth.isLogOut, isBlocked, profileController.loadEditprofile);
user_route.post('/editProfile', auth.isLogOut, isBlocked, profileController.updateProfile);
user_route.get('/changePassword', auth.isLogOut, isBlocked, profileController.loadChangepassword);
user_route.post('/changePassword', auth.isLogOut, isBlocked, profileController.changePassword);
user_route.get('/addAddress', auth.isLogOut, isBlocked, profileController.loadAddaddress);
user_route.post('/addAddress', auth.isLogOut, isBlocked, profileController.insertAddress);
user_route.get('/editAddress', auth.isLogOut, isBlocked, profileController.loadEditaddress);
user_route.post('/editAddress', auth.isLogOut, isBlocked, profileController.updatEditaddress);
user_route.post('/deletAddress', auth.isLogOut, isBlocked, profileController.deletAddress);
user_route.get('/orderHistory', auth.isLogOut, isBlocked, profileController.loadOrHistory);
user_route.get('/invoice', auth.isLogOut, isBlocked, profileController.loadInvoice);



// CART
user_route.get('/cart', auth.isLogOut, isBlocked, cartController.loadCart);
user_route.post('/addtocart', auth.isLogOut, isBlocked, cartController.addtoCart);
user_route.post('/removeToCart', auth.isLogOut, isBlocked, cartController.removeToCart);
user_route.post('/updateQuantity', auth.isLogOut, isBlocked, cartController.updateQuantity);



// WISHLIST
user_route.get('/wishlist', auth.isLogOut, isBlocked, wishlistController.loadWishlist);
user_route.post('/addToWishlist', auth.isLogOut, isBlocked, wishlistController.addtoWishlist);
user_route.post('/removeToWishlist', auth.isLogOut, isBlocked, wishlistController.removeToWishlist);
user_route.post('/addingcart', auth.isLogOut, isBlocked, wishlistController.addingCart);



// Checkout
user_route.get('/checkout', auth.isLogOut, isBlocked, checkoutController.loadCheckout);
user_route.post('/addaddressCheckout', auth.isLogOut, isBlocked, checkoutController.checkoutAddAddress);
user_route.post('/placeOrder', auth.isLogOut, isBlocked, checkoutController.placeOrder);
user_route.post('/verifyPayment', auth.isLogOut, isBlocked, checkoutController.verifyPayment);
user_route.post('/countinuePayment', auth.isLogOut, isBlocked, checkoutController.paymentCountinue);
user_route.put('/applycoupon', auth.isLogOut, isBlocked, checkoutController.applyCoupon);
user_route.put('/removecoupon', auth.isLogOut, isBlocked, checkoutController.removeCoupon);



// Oreder
user_route.get('/orderSuccess/:id', auth.isLogOut, isBlocked, ordreController.loadOrderSuccess);
user_route.get('/orderDetails', auth.isLogOut, isBlocked, ordreController.loadOrderDetails);
user_route.post('/cancelOrder', auth.isLogOut, isBlocked, ordreController.cancelOrder);
user_route.post('/returnOrderRequest', auth.isLogOut, isBlocked, ordreController.returnOrder);


user_route.get('/wallet', auth.isLogOut, isBlocked, walletController.loadWallet)



module.exports = user_route;