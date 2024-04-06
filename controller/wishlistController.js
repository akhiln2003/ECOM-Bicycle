const { findOne } = require('../models/cartModel');
const Wishlist = require('../models/whishListModel');

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

module.exports = {
    loadWishlist,
    addtoWishlist,
    removeToWishlist
}