const { findOne } = require('../models/cartModel');
const Wishlist = require('../models/whishListModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

const loadWishlist = async(req,res)=>{
    try {
        const userId = req.session.user._id;
        const wishlist = await Wishlist.find({userId:userId}).populate('products.productId');
        res.render('whishlist',{wishlist});
    } catch (error) {
        console.log(error);
    }
}

const addtoWishlist = async(req,res)=>{
    try {
        const productId = req.body.productId;
        const userId = req.session.user._id;
         const wishlist = await Wishlist.findOne({userId:userId});
         if(wishlist){
            const existProduct = await  wishlist.products.find((product)=>product.productId == productId);
            if(existProduct){
                res.json({existedProduct :true});
            }else{
                await Wishlist.findOneAndUpdate({userId:userId},{
                    $push:{
                        products:{
                            productId:productId
                        }
                    }
                })
            }
         }else{
            const newWishlist = new Wishlist({
                userId:userId,
                products:[
                    {
                        productId:productId,
                    }
                ]
            });
            await newWishlist.save();
         }
         res.json({ok:true});
    } catch (error) {
        console.log(error);
    }
}


const removeToWishlist = async(req,res)=>{
    try {
        const productId = req.body.productId;
        const userId = req.session.user._id;
        const wishlist = await Wishlist.findOne({userId:userId});
        if(wishlist){
            await Wishlist.findOneAndUpdate({userId:userId},{
                $pull:{
                    products:{productId:productId}
                }
            })
        }
        res.json({ok:true});
    } catch (error) {
        console.log(error);
    }
}


const addingCart = async(req,res)=>{
    try {
        const {productId} = req.body;
        const userId = req.session.user._id;
        const product  =  await Product.findOne({_id:productId}).populate('category');
        const cart = await Cart.findOne({userId:userId});
        if(cart){
            const existProduct = await cart.products.find((product)=>product.productId == productId);
            if(existProduct){
                return res.json({existProduct:true})
            }else{
               await Cart.findOneAndUpdate({userId:userId},{
                $push:{
                    products:{
                        productId:productId,
                        quantity:1,
                        price:product.productPrice,
                        totalPrice: product.productPrice                    }
                }
               })
               res.json({ok:true});
            }
           }else{
            const newCart = new Cart({
                userId:userId,
                products:[
                    {
                        productId:productId,
                        quantity:1,
                        price:product.productPrice,
                        totalPrice: product.productPrice
                    }
                ]
            })
            await newCart.save();
            res.json({ok:true});
           }
          
        
       
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadWishlist,
    addtoWishlist,
    removeToWishlist,
    addingCart
}