const express = require('express');
const admin_route = express();
const auth = require('../middleware/adminAuth');
const adminController = require("../controller/adminController");
const brandController = require("../controller/brandController");
const categoryController = require("../controller/categoryController");
const productController = require("../controller/productController");
const customerController = require("../controller/customerController");




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

                             //CUSTEMERS
admin_route.get('/customers',auth.isLogOut,customerController.loadCustomers);
admin_route.post('/blockUser',auth.isLogOut,customerController.blockUser);

                            // PRODUCTS
admin_route.get('/products',auth.isLogOut,productController.loadProducts);
admin_route.get('/addProduct',auth.isLogOut,productController.loadAddproduct);

                            // CATEGORY
admin_route.get('/category',auth.isLogOut,categoryController.loadCategory);
admin_route.get('/addCategory',auth.isLogOut,categoryController.loadAddcategory);
admin_route.post('/addcategory',auth.isLogOut,categoryController.insertCategory);
admin_route.get('/editCategory',auth.isLogOut,categoryController.loadEditcategory);
admin_route.post('/editCategory',auth.isLogOut,categoryController.updateCategory);
admin_route.post('/deleteCategory',auth.isLogOut,categoryController.isDeleted);





                            // BRAND
admin_route.get('/brand',auth.isLogOut,brandController.loadBrand);
admin_route.get('/addBrand',auth.isLogOut,brandController.loadAddBrand)





module.exports = admin_route
