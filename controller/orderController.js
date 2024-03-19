const Product = require('../models/productModel');
const User = require('../models/userModel');
const Orders = require('../models/orderModel');
const { findOneAndUpdate } = require('../models/cartModel');




const loadOrderSuccess = async(req,res)=>{
    try {
        const orderId = req.params.id;
        const orderDetails = Product.findOne({_id:orderId}).populate('products.productId');
        res.render('orderSuccess',{orderId});
    } catch (error) {
        console.log(error);
    }
}

const loadOrderDetails = async(req,res)=>{
    try {
        const orderId = req.query.id;
        const userId = req.session.user._id;
        const orders = await Orders.findOne({userId:userId,_id:orderId }).populate('products.productId');
        res.render('orderDetails',{orders});
    } catch (error) {
        console.log(error);
    }
}


const cancelOrder = async(req,res)=>{
    try {
        const {productId,orderId} = req.body;
        await Orders.findOneAndUpdate({_id:orderId,'products._id':productId},{$set:{'products.$.status':'cancelled'}});
        res.json({ok:true});

    } catch (error) {
        console.log(error);
    }
}




module.exports = {
    loadOrderSuccess,
    loadOrderDetails,
    cancelOrder

}