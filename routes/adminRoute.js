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
const adminCouponController = require('../controller/adminCouponController');
const adminSalesreport = require('../controller/salesreportControllet');
const offerController = require('../controller/adminOfferController');
require('dotenv').config();



const nocache = require('nocache');
const session = require('express-session');

admin_route.use(session({ secret: process.env.sessionSecret, resave: false, saveUninitialized: false }));


admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');

admin_route.use(nocache());

admin_route.use(express.json());
admin_route.use(express.urlencoded({ extended: true }));



admin_route.get('/', auth.isLogin, adminController.adminLogin);
admin_route.post('/loginSubmit', auth.isLogin, adminController.varifyLogin);
admin_route.get('/logOut', adminController.adminLogOut);
admin_route.get('/dashboard', auth.isLogOut, adminController.loadDashboard);

admin_route.get('/salesreport', auth.isLogOut, adminSalesreport.loadSalesreport);
admin_route.post('/listsails', auth.isLogOut, adminSalesreport.listOrders);
admin_route.post("/downloadExcel", auth.isLogOut, adminSalesreport.dowloadExcel);

//CUSTEMERS
admin_route.get('/customers', auth.isLogOut, customerController.loadCustomers);
admin_route.post('/blockUser', auth.isLogOut, customerController.blockUser);

// PRODUCTS
admin_route.get('/products', auth.isLogOut, productController.loadProducts);
admin_route.get('/addProduct', auth.isLogOut, productController.loadAddproduct);
admin_route.post('/addProduct', auth.isLogOut, multer.upload.array('image'), productController.addProducts);
admin_route.get('/editProduct', auth.isLogOut, productController.loadEditproduct);
admin_route.post('/editProduct', auth.isLogOut, multer.upload.array('image'), productController.editProducts);
admin_route.post('/deleteProduct', auth.isLogOut, productController.isDeleted);
admin_route.get('/showproductOffers', auth.isLogOut, productController.loadOffers);
admin_route.put('/applyProductOffer', auth.isLogOut, productController.applyOffer);
admin_route.put('/removeProductOffer', auth.isLogOut, productController.removeOffer);




// CATEGORY
admin_route.get('/category', auth.isLogOut, categoryController.loadCategory);
admin_route.get('/addCategory', auth.isLogOut, categoryController.loadAddcategory);
admin_route.post('/addcategory', auth.isLogOut, categoryController.insertCategory);
admin_route.get('/editCategory', auth.isLogOut, categoryController.loadEditcategory);
admin_route.post('/editCategory', auth.isLogOut, categoryController.updateCategory);
admin_route.post('/deleteCategory', auth.isLogOut, categoryController.isDeleted);
admin_route.get('/showcategoryOffers', auth.isLogOut, categoryController.loadOffers);
admin_route.put('/applyCategoryOffer', auth.isLogOut, categoryController.applyOffer);
admin_route.put('/removeCategoryOffer', auth.isLogOut, categoryController.removeOffer);


// ORDERS
admin_route.get('/orders', auth.isLogOut, adminOrderController.loadOrders);
admin_route.get('/orderDetails', auth.isLogOut, adminOrderController.loadOrderdetails);
admin_route.post('/cancelOrder', auth.isLogOut, adminOrderController.cancelOrder);
admin_route.post('/changeOrderStatus', auth.isLogOut, adminOrderController.changeOrderStatus);
admin_route.get('/returns', auth.isLogOut, adminOrderController.loadReturn);
admin_route.get('/returnDetails', auth.isLogOut, adminOrderController.loadReturnDetails);
admin_route.post('/changeReturnStaturs', auth.isLogOut, adminOrderController.changeReturnStatus);



// COUPON
admin_route.get('/coupon', auth.isLogOut, adminCouponController.loadCoupon);
admin_route.get('/addcoupon', auth.isLogOut, adminCouponController.loadAddcoupon);
admin_route.post('/addcoupon', auth.isLogOut, adminCouponController.addCoupon);
admin_route.post('/deleteCoupon', auth.isLogOut, adminCouponController.deleteCoupon);
admin_route.get('/editCoupon', auth.isLogOut, adminCouponController.loadEditcoupon);
admin_route.put('/updatecoupon', auth.isLogOut, adminCouponController.updateCoupon);


// BRAND
admin_route.get('/brand', auth.isLogOut, brandController.loadBrand);
admin_route.get('/addBrand', auth.isLogOut, brandController.loadAddBrand);

// OFFER
admin_route.get('/offer', auth.isLogOut, offerController.loadOffer);
admin_route.get('/addoffer', auth.isLogOut, offerController.loadAddOffer);
admin_route.post('/addoffer', auth.isLogOut, offerController.addOffer);
admin_route.get('/editoffer', auth.isLogOut, offerController.loadEditoffer);
admin_route.post('/editoffer', auth.isLogOut, offerController.editOffer);
admin_route.post('/deleteoffer', auth.isLogOut, offerController.deleteOffer);








module.exports = admin_route
