const Product = require('../models/productModel');
                          
                      
             
            // Load Products           
const loadProducts =  async(req,res)=>{
        try {
            res.render('products');
        } catch (error) {
            console.log(error);
        }
     }


           // Load Add Products
const loadAddproduct = async(req,res)=>{
        try {
            res.render('addProduct');
        } catch (error) {
            console.log(error);
        }
    }

        // insert products
const insertProducts = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error);
    }
}                                        
                                        
module.exports = {
    loadProducts,
    loadAddproduct,
}