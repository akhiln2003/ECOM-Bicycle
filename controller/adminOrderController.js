 const Orders = require('../models/orderModel');


        // LOAD ORDERS
const loadOrders = async(req,res)=>{
    try {
        let page = 1; 
        if(req.query.page){
            page = parseInt(req.query.page);
        }
        let next = page + 1;
        let previous = page > 1 ? page - 1 : 1 ;
        let limit = 10;
        const count = await Orders.find().count();
        const totalPages = Math.ceil(count/limit);

        if(next > totalPages){
            next = totalPages
        }

        const orders = await Orders.find().populate('userId').limit(limit).skip((page - 1)* limit);
        res.render('orders',{orders,totalPages,next,previous});
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
                'products.$.status': 'cancelled' 
            }
        });
        res.json({ok:true})
    } catch (error) {
        console.log(error);
    }
}


const changeOrderStatus = async(req,res)=>{
    try {
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