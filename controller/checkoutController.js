const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');



const placeOrder = async(req,res)=>{
    try {
        const {index,payment,subTotal} = req.body;
        const userId  = req.session.user._id;
        const userCart = await Cart.findOne({userId:userId}).populate('products.productId');
        const products =  userCart.products
        let quantityLess = 0;
        products.forEach((product)=>{
            if(product.productId.stok <= 0){
                quantityLess = product.productId.name;
            }
        });
        if(quantityLess){
            res.json({quan:true,quantityLess})
        }else{
            const user = await User.findOne({_id:userId});
            const status = payment == 'COD' ? 'placed' : 'pending';
            const address = user.address[index];
            const date = Date.now();
            const orders = new Order({
                userId:userId,
                products:products,
                totalAmount:subTotal,
                date:date,
                status:status,
                paymentMethod:payment,
                deliveryAddress:address
            });
            const orderDetails = await orders.save();
            const orderId = orderDetails._id;

            if(orderDetails.status == 'placed'){
                await Cart.deleteOne({userId:userId});
                for(i=0;i<products.length;i++){
                    const productId =  products[i].productId;
                    const productQuantity =  products[i].quantity;
                    await Product.updateOne({_id:productId},{$inc:{stock:-productQuantity}})

                }
                res.json({ ok: true, orderId });
            }

        }
        
    } catch (error) {
        console.log(error);
    }
}


const loadOrderSuccess = async(req,res)=>{
    try {
        const orderId = req.params.id;
        const orderDetails = Product.findOne({_id:orderId}).populate('products.productId');
        res.render('orderSuccess',{orderDetails});
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    placeOrder,
    loadOrderSuccess
}