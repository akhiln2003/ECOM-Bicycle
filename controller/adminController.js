const User = require('../models/userModel');
const bcrypt = require('bcrypt');

                // LOGIN AND LOGOUT SECTON START //

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

                            // LOGIN AND LOGOUT SECTON END //
                            
                            // DASHBOADR SECTON START //


        // lodDashboard
 const loadDashboard = async(req,res)=>{
    try {
        res.render('dashboard');
    } catch (error) {
        console.log(error);
    }
 }
                              // DASHBOADR SECTON END //

                             // CUSTOMERS SECTON START //

        //customers listing
 const loadCustomers = async(req,res)=>{
    try {
        const users = await User.find();
        res.render('customers',{users:users});

    } catch (error) {
        console.log(error);
    }
 }

        //Bblock and Unblock customers
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

                          // CUSTOMERS  SECTION END  //

                         //  PRODUCT  SECTON START//
             
            // Load Products           
const loadProducts =  async(req,res)=>{
    try {
        res.render('products');
    } catch (error) {
        console.log(error);
    }
}
            //Add Products
const loadAddproduct = async(req,res)=>{
    try {
        res.render('addProduct');
    } catch (error) {
        console.log(error);
    }
}
                              // PRODUCT SECTON START //

                              // CATEGORY SECTON START //
            
            // Load Category         
const loadCategory = async(req,res)=>{
    try {
        res.render('category');
    } catch (error) {
        console.log(error);
    }
}

        // Add Category
const loadAddcategory = async(rdq,res)=>{
    try {
        res.render('addCategory');
    } catch (error) {
        console.log(error);
    }
}

                            // CATEGORY SECTON END // 

                            // CATEGORY BRAND END // 

        //Brand
const loadBrand = async(req,res)=>{
    try {
        res.render('brands');
    } catch (error) {
        console.log(error);
    }
}

        // Add Brand
const loadAddBrand = async(req,res)=>{
    try {
        res.render('addBrand');
    } catch (error) {
        console.log(error);
    }
}
        

                            // CATEGORY BRAAND END // 

module.exports = {
    adminLogin,
    varifyLogin,
    loadDashboard,
    adminLogOut,
    loadCustomers,
    blockUser,
    loadProducts,
    loadAddproduct,
    loadCategory,
    loadAddcategory,
    loadBrand,
    loadAddBrand

}