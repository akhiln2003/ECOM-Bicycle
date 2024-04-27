const Cart = require('../models/cartModel');

const loadCartMiddleware = async(req ,res ,next)=>{
    try {
        if(req.session.user && req.session.user._id){
            const userId = req.session.user._id;
            const cart = await Cart.findOne({userId:userId});
            if(cart){
               res.locals.cartDetais= cart 
            }
        }
        next()
    } catch (error) {
        console.log(error);
    }
}


module.exports={
    loadCartMiddleware
  }