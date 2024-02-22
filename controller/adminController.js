const User = require('../models/userModel');
const bcrypt = require('bcrypt');

    // Loading Admin Login
const adminLogin = async(req,res)=>{
    try {
        res.render('adminLogin');
    } catch (error) {
        console.log(error);
    }
}    
     // varifyLogin
const varifyLogin = async(req,res)=>{
   try {
     const email = req.body.email;
     const password = req.body.password;
     if(email == process.env.adminEmail && password == process.env.adminPassword){
        req.session.admin = {
            email: email
            
        }
        res.redirect('/admin/dashboard');
     }else{
        req.flash('error',"Email or Password is incorrect");
        res.redirect('/admin');
     }
   } catch (error) {
    console.log(error);
   }

}
        // admin LogOut
 const adminLogOut = async(req,res)=>{
    try {
        req.session.admin = null;
        res.redirect('/admin')
    } catch (error) {
        console.log(error);
    }
 }


        // lodDAshboard
 const loadDashboard = async(req,res)=>{
    try {
        res.render('dashboard');
    } catch (error) {
        console.log(error);
    }
 }
        //customers listing
 const loadCustomers = async(req,res)=>{
    try {
        const users = await User.find();
        res.render('customers',{users:users});

    } catch (error) {
        console.log(error);
    }
 }

        //Bblock and Unblock user
const blockUser = async(req,res)=>{
    try {
        const  id= req.body.id;
      const user = await User.findOne({_id:id});
      if(user.blocked){
        await User.updateOne({_id:id},{$set:{blocked:false}});
      }else{
        await User.updateOne({_id:id},{$set:{blocked:true}});
      }
      res.json({blocked:true});
    } catch (error) {
        console.log(error);
    }
}
       // Load Products
const loadProducts =  async(req,res)=>{
    try {
        res.render('products');
    } catch (error) {
        console.log(error);
    }
}
const loadAddproduct = async(req,res)=>{
    try {
        res.render('addProduct');
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    adminLogin,
    varifyLogin,
    loadDashboard,
    adminLogOut,
    loadCustomers,
    blockUser,
    loadProducts,
    loadAddproduct

}