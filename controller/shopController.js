const Product = require('../models/productModel');


const loadShop = async(req,res)=>{
    try {
        const products = await Product.find({isDeleted:false});
        res.render('shop',{products});
    } catch (error) {
        console.log(error);
    }
}

const loadProductDetails = async(req,res)=>{
    try {
        const id = req.query.id;
        const product = await Product.findOne({_id:id});
        const category = product.category
        const relatedProduct =  await Product.find({category:category});
        res.render('productDetails',{product,relatedProduct});
    } catch (error) {
        console.log(error);
    }
}


module.exports ={
    loadShop,
    loadProductDetails
}