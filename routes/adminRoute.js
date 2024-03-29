const express = require('express');
const admin_route = express();
const auth = require('../middleware/adminAuth');
const multer = require('../middleware/multer');
const adminController = require("../controller/adminController");
const brandController = require("../controller/brandController");
const categoryController = require("../controller/categoryController");
const productController = require("../controller/productController");
const customerController = require("../controller/customerController");
const adminOrderController = require('../controller/adminOrderController');
require('dotenv').config();



const nocache = require('nocache');
const session = require('express-session');

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
admin_route.post('/addProduct',auth.isLogOut,multer.upload.array('image'),productController.addProducts);
admin_route.get('/editProduct',auth.isLogOut,productController.loadEditproduct);
admin_route.post('/editProduct',auth.isLogOut,multer.upload.array('image'),productController.editProducts);
admin_route.post('/deleteProduct',auth.isLogOut,productController.isDeleted)



                            // CATEGORY
admin_route.get('/category',auth.isLogOut,categoryController.loadCategory);
admin_route.get('/addCategory',auth.isLogOut,categoryController.loadAddcategory);
admin_route.post('/addcategory',auth.isLogOut,categoryController.insertCategory);
admin_route.get('/editCategory',auth.isLogOut,categoryController.loadEditcategory);
admin_route.post('/editCategory',auth.isLogOut,categoryController.updateCategory);
admin_route.post('/deleteCategory',auth.isLogOut,categoryController.isDeleted);

                            // ORDERS
admin_route.get('/orders',auth.isLogOut,adminOrderController.loadOrders);
admin_route.get('/orderDerails',auth.isLogOut,adminOrderController.loadOrderdetails);
admin_route.post('/cancelOrder',auth.isLogOut,adminOrderController.cancelOrder);
admin_route.post('/changeOrderStatus',auth.isLogOut,adminOrderController.changeOrderStatus);


                            // BRAND
admin_route.get('/brand',auth.isLogOut,brandController.loadBrand);
admin_route.get('/addBrand',auth.isLogOut,brandController.loadAddBrand)





module.exports = admin_route
