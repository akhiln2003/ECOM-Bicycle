const express = require('express');
const admin_route = express();
const auth = require('../middleware/adminAuth');
const adminController = require("../controller/adminController");
const nocache = require('nocache');
const session = require('express-session');
require('dotenv').config();
admin_route.use(session({secret: process.env.sessionSecret,resave:false,saveUninitialized:false}));


admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

admin_route.use(nocache());

admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:true}));



admin_route.get('/',auth.isLogin,adminController.adminLogin);
admin_route.post('/loginSubmit',auth.isLogin,adminController.varifyLogin);
admin_route.get('/logOut',adminController.adminLogOut);
admin_route.get('/dashboard',auth.isLogOut,adminController.loadDashboard);

        //Customers
admin_route.get('/customers',auth.isLogOut,adminController.loadCustomers);
admin_route.post('/blockUser',auth.isLogOut,adminController.blockUser);

        // Products
admin_route.get('/products',auth.isLogOut,adminController.loadProducts);
admin_route.get('/addProduct',auth.isLogOut,adminController.loadAddproduct);





module.exports = admin_route
