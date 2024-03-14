const Product = require('../models/productModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');


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
        const productId = req.query.id;
        const userId = req.session.user._id;
        const product = await Product.findOne({_id:productId});
        const user =  await User.findOne({_id:userId});
        const category = product.category;
        const relatedProduct =  await Product.find({category:category});
        if(user){
            const existscart  = await Cart.findOne({userId:userId});
            if(existscart){
                const existsProduct  = await existscart.products.find((product)=> product.productId.toString() == productId);
                if(existsProduct){
                  return  res.render('productDetails',{product,relatedProduct,inCart:true});
                }
            }
        }
        res.render('productDetails',{product,relatedProduct,inCart:false});
    } catch (error) {
        res.render('error404')
        console.log(error);
    }
}


module.exports ={
    loadShop,
    loadProductDetails
}