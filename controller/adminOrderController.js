 const Orders = require('../models/orderModel');


        // LOAD ORDERS
const loadOrders = async(req,res)=>{
    try {
        const orders = await Orders.find().populate('userId')
        res.render('orders',{orders});
    } catch (error) {
        console.log(error);
    }
}


        // LOAD ORDER DETAILS
const loadOrderdetails = async (req, res) => {
    try {
        const orderId = req.query.id.trim(); 
        const order = await Orders.findById(orderId).populate('products.productId').populate('userId'); 
        res.render('adminOrderDetails',{order});
    } catch (error) {
        console.log(error);
    }
}      

        // CANCEL ORDER
const cancelOrder = async(req,res)=>{
    try {
        console.log(req.body);
        const {productId,orderId}=req.body;
        await Orders.findOneAndUpdate({_id:orderId,'products._id':productId},{
            $set:{
                'products.$.status': 'cancelld' 
            }
        });
        res.json({ok:true})
    } catch (error) {
        console.log(error);
    }
}


const changeOrderStatus = async(req,res)=>{
    try {
        console.log(req.body);
        const{orderId,productId,status} = req.body;
        await Orders.findOneAndUpdate({_id:orderId,'products._id':productId},{
            $set:{
                'products.$.status': status 
            }
        })
        res.json({ok:true})
    } catch (error) {
        console.log(error);
    }
}





module.exports={
    loadOrders,
    loadOrderdetails,
    cancelOrder,
    changeOrderStatus
}