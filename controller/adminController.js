const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const Order = require('../models/orderModel');
const Products = require('../models/productModel');
const { isDefined } = require('razorpay/dist/utils/razorpay-utils');

// LOGIN AND LOGOUT SECTON START //

// Loading Admin Login
const adminLogin = async (req, res) => {
    try {
        res.render('adminLogin');
    } catch (error) {
        console.log(error);
    }
}
// varifyLogin
const varifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (email == process.env.adminEmail && password == process.env.adminPassword) {
            req.session.admin = {
                email: email

            }
            res.redirect('/admin/dashboard');
        } else {
            req.flash('error', "Email or Password is incorrect");
            res.redirect('/admin');
        }
    } catch (error) {
        console.log(error);
    }

}
// admin LogOut
const adminLogOut = async (req, res) => {
    try {
        req.session.admin = null;
        res.redirect('/admin')
    } catch (error) {
        console.log(error);
    }
}

// LOGIN AND LOGOUT SECTON END //


// DASHBOADR SECTON START //


// lodDashboard
const loadDashboard = async (req, res) => {
    try {
        // Orders count 
        const orderscount = await Order.countDocuments({ status: "placed" });

        // Product count 
        const productscount = await Products.countDocuments({ isDeleted: false });

        // Total revenue 
        const revenueResult = await Order.aggregate([
            { $match: { status: "placed" } },
            { $unwind: "$products" },
            { $match: { "products.status": "delivered" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
                }
            }
        ]);
        const totalRevenue = revenueResult.length ? revenueResult[0].totalRevenue : 0;

        // Monthly Revenue and Orders Count
        const monthlyResult = await Order.aggregate([
            { $match: { status: "placed" } },
            { $unwind: "$products" },
            { $match: { "products.status": "delivered" } },
            {
                $group: {
                    _id: { month: { $month: "$date" } },
                    totalRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Create an array to hold monthly earnings
        const monthlyEarnings = Array.from({ length: 12 }, (_, i) => {
            const monthData = monthlyResult.find(month => month._id.month === i + 1);
            return {
                month: i + 1,
                totalRevenue: monthData ? monthData.totalRevenue : 0,
                count: monthData ? monthData.count : 0
            };
        });

        const currentDate = new Date();
        const currentMonthRevenue = monthlyEarnings.find(month => month.month === currentDate.getMonth() + 1)?.totalRevenue || 0;


        // Monthly Users Count
        const monthlyUser = await User.aggregate([
            {
                $match: {
                    verified: { $exists: true }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$dateJoined' },


                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id.month',

                    count: 1
                }
            },
            {
                $sort: {
                    month: 1,

                }
            }
        ]);


        const userMonthly = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            count: 0
        }));
        const monthlyUserCounts = userMonthly.map((defaultMonth) => {
            const foundMonth = monthlyUser.find((monthlyData) => monthlyData.month === defaultMonth.month);
            return {
                month: defaultMonth.month,
                count: foundMonth ? foundMonth.count : 0,
            };
        });

        // Top 5 products 
        const topProducts = await Order.aggregate([
            { $match: { status: "placed" } },
            { $unwind: "$products" },
            { $match: { "products.status": "delivered" } },
            { $group: { _id: "$products.productId", quantity: { $sum: "$products.quantity" } } },
            { $sort: { quantity: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $project: {
                    _id: "$_id",
                    productName: { $arrayElemAt: ["$productDetails.productName", 0] },
                    productImg: { $arrayElemAt: ["$productDetails.image", 0] },
                }
            }

        ]);
        // Top 5 categorys
        const topCategories = await Order.aggregate([
            { $match: { 'products.status': 'delivered' } },
            { $unwind: '$products' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { orderCount: -1 } },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $project: {
                    categoryName: '$category.categoryName',
                    orderCount: 1
                }
            },
            { $sort: { orderCount: -1 } }
        ]);


        console.log(topCategories);

        res.render('dashboard',
            {
                orderscount,
                totalRevenue,
                productscount,
                monthlyEarnings,
                currentMonthRevenue,
                monthlyUserCounts,
                topProducts,
                topCategories


            });
    } catch (error) {
        console.log(error);
    }
}

// DASHBOADR SECTON END //


module.exports = {
    adminLogin,
    varifyLogin,
    loadDashboard,
    adminLogOut,


}