const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
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


const loadDashboard = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const deliveredOrdersCount = await Order.countDocuments({ "products.status": "delivered" });
        const productsCount = await Products.countDocuments({ isDeleted: false });

        const revenueData = await Order.aggregate([
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.status",
                    total: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
                }
            }
        ]);

        let totalRevenue = 0;
        revenueData.forEach(item => {
            if (item._id === 'delivered') {
                totalRevenue += item.total;
            } else if (item._id === 'returned' || item._id === 'cancelled') {
                totalRevenue -= item.total;
            }
        });

        const monthlyData = await Order.aggregate([
            { $unwind: "$products" },
            {
                $group: {
                    _id: { month: { $month: "$date" }, status: "$products.status" },
                    total: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
                    count: { $sum: 1 }
                }
            }
        ]);

        const monthlyEarnings = Array(12).fill(0);
        const monthlyOrders = Array(12).fill(0);

        monthlyData.forEach(item => {
            const monthIndex = item._id.month - 1;
            if (item._id.status === 'delivered') {
                monthlyEarnings[monthIndex] += item.total;
                monthlyOrders[monthIndex] += item.count;
            } else if (item._id.status === 'returned' || item._id.status === 'cancelled') {
                monthlyEarnings[monthIndex] -= item.total;
            }
        });
        
        const currentMonthRevenue = monthlyEarnings[new Date().getMonth()];
        const monthlyUsers = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$dateJoined" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const monthlyUserCounts = Array(12).fill(0);
        monthlyUsers.forEach(item => {
            monthlyUserCounts[item._id - 1] = item.count;
        });

        const topProducts = await Order.aggregate([
            { $match: { "products.status": "delivered" } },
            { $unwind: "$products" },
            { $group: { _id: "$products.productId", count: { $sum: "$products.quantity" } } },
            { $sort: { count: -1 } },
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
                    _id: 1,
                    productName: { $arrayElemAt: ["$productDetails.productName", 0] },
                    productImg: { $arrayElemAt: ["$productDetails.image", 0] }
                }
            }
        ]);

        const topCategories = await Order.aggregate([
            { $match: { "products.status": "delivered" } },
            { $unwind: "$products" },
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" },
            { $group: { _id: "$productInfo.category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    categoryName: { $arrayElemAt: ["$categoryDetails.categoryName", 0] }
                }
            }
        ]);
        
        res.render('dashboard', {
            totalRevenue,
            orderscount: deliveredOrdersCount,
            productscount: productsCount,
            currentMonthRevenue,
            monthlyEarnings: monthlyEarnings.map((totalRevenue, index) => ({
                month: index + 1,
                totalRevenue,
                count: monthlyOrders[index]
            })),
            monthlyUserCounts: monthlyUserCounts.map((count, index) => ({
              month: index + 1,
              count
          })),
            topProducts,
            topCategories
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}

// DASHBOADR SECTON END //


module.exports = {
    adminLogin,
    varifyLogin,
    loadDashboard,
    adminLogOut,


}