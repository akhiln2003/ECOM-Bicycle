const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const dotenv = require("dotenv")
dotenv.config()


let instance = new Razorpay({ 
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
   })



function generateRandomId(){
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0].replace(/-/g, '');
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    const orderId = `ORD${formattedDate}${randomNumber}`;

    return orderId
}


const checkoutAddAddress =  async(req,res)=>{
    try {
       const id = req.session.user._id;
       const {name,state,city,pin,phone}=req.body;
      await User.findOneAndUpdate({_id:id},{
        $push:{
        address:{
        name:name,
        state:state,
        city:city,
        pin:pin,
        phone:phone
        }
      }});
      res.redirect('/checkout')
        
    } catch (error) {
        console.log(error);
    }
}

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
            const orderid=generateRandomId();
            const orders = new Order({
                userId:userId,
                orderId:orderid,
                products:products,
                totalAmount:subTotal,
                date:date,
                status:status,
                paymentMethod:payment,
                deliveryAddress:address
            });
            const orderDetails = await orders.save();
            const orderId = orderDetails.orderId;

                    //  COD PAYMENT 
            if(orderDetails.paymentMethod == 'COD'){
                await Cart.deleteOne({userId:userId});
                for(i=0;i<products.length;i++){
                    const productId =  products[i].productId;
                    const productQuantity =  products[i].quantity;
                    await Product.updateOne({_id:productId},{$inc:{stock:-productQuantity}})

                }
                const orderId = orderDetails.orderId;
                const order = await Order.findOne({orderId:orderId})
                await  Order.findOneAndUpdate({orderId: orderDetails.orderId,},{
                    $set:{"products.$[].status": "placed" }
                 })
                res.json({ ok: true, orderId });
            }
                        // RAZORPAY PAYMENT 
            else if(orderDetails.paymentMethod=="RAZORPAY"){
                
                const options = {
                    amount:subTotal*100,
                    currency: "INR",
                    receipt: "" + orderId,
                };

                instance.orders.create(options,(error,order)=>{
                    if(error){
                        console.error(error);
                        return res.status(500).json({ error: "Error creating Razorpay order" });
                    }
                   return res.json({okk : true,order});
                })

            }else if(orderDetails.paymentMethod == "WALLET"){

            }else{

            }

        }
        
    } catch (error) {
        console.log(error);
    }
}

const verifyPayment = async(req,res)=>{
    const {paymetn,order} = req.body;
    const userId = req.session.user._id;
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(paymetn.razorpay_order_id + '|' + paymetn.razorpay_payment_id);
    const hmacValue = hmac.digest("hex");
    if(hmacValue == paymetn.razorpay_signature){
        const cart = await Cart.findOne({userId:userId}).populate('products.productId');
        const products = cart.products;
        for(i=0;i<products.length;i++){
            let productId = products[i].productId;
            let productQuantity = products[i].quantity;
            await Product.updateOne({_id:productId},{$inc:{stock:-productQuantity}});
        }
         await  Order.findOneAndUpdate({
            orderId: order.receipt,
            "products.productId": { $in: products.map(product => product.productId) },
         },{
            $set:{
                "products.$[].status": "placed",
                paymentId: paymetn.razorpay_payment_id,
            }
         });
         await Cart.deleteOne({ userId: userId });
         const orderId =  order.receipt
         res.json({ paymentSuccess: true,orderId });
    }
}

module.exports = {
    placeOrder,
    checkoutAddAddress,
    verifyPayment
    
}