const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const Order = require('../models/orderModel');

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
        const result = await Order.aggregate([
            { $unwind: '$products' },
            { $match: { 'products.status': 'delivered' } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);
        const orderscount = result.length > 0 ? result[0].count : 0;
        res.render('dashboard', { orderscount });
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