const Product = require('../models/productModel');
const User = require('../models/userModel');
const Orders = require('../models/orderModel');
const Coupon = require('../models/couponModel');
const { findOneAndUpdate } = require('../models/cartModel');




const loadOrderSuccess = async(req,res)=>{
    try {
        const orderId = req.params.id;
        res.render('orderSuccess',{orderId});
    } catch (error) {
        console.log(error);
    }
}

const loadOrderDetails = async(req,res)=>{
    try {
        const orderId = req.query.id;
        const userId = req.session.user._id;
        const order = await Orders.findOne({userId:userId,orderId:orderId })
        let orders;
        if(order.couponUsed){

             orders = await Orders.findOne({userId:userId,orderId:orderId }).populate('products.productId').populate('couponUsed');
        }else{
            orders = await Orders.findOne({userId:userId,orderId:orderId }).populate('products.productId')
        }
        
        res.render('orderDetails',{orders});
    } catch (error) {
        console.log(error);
    }
}


const cancelOrder = async(req,res)=>{
    try {
        const {productId,orderId,resion} = req.body;
        await Orders.findOneAndUpdate({_id:orderId,'products._id':productId},{$set:{'products.$.status':'cancelled','products.$.cancelReason':resion}});
        res.json({ok:true});
    } catch (error) {
        console.log(error);
    }
}

const returnOrder = async(req,res)=>{
    try {
        const {productId,orderId,resion} = req.body;
        await Orders.findOneAndUpdate({_id:orderId,'products._id':productId},{$set:{'products.$.status':'returnRequested','products.$.returnReason':resion}});
        res.json({ok:true})
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    loadOrderSuccess,
    loadOrderDetails,
    cancelOrder,
    returnOrder

}