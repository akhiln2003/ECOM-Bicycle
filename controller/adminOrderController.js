 const Orders = require('../models/orderModel');


const loadOrders = async(req,res)=>{
    try {
        const orders = await Orders.find().populate('userId')
        console.log(orders);
        res.render('orders',{orders});
    } catch (error) {
        console.log(error);
    }
}


module.exports={
    loadOrders
}