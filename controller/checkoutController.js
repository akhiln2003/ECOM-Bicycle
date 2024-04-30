const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const Wallet = require('../models/walletModel');
const ObjectId = require('mongoose').Types.ObjectId;
const crypto = require('crypto');
const Razorpay = require('razorpay');
const dotenv = require("dotenv")
dotenv.config()


let instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})



function generateRandomId() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0].replace(/-/g, '');
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    const orderId = `ORD${formattedDate}${randomNumber}`;

    return orderId
}


//  Load Procced To Checkout page
const loadCheckout = async (req, res) => {
    try {
        const id = req.session.user._id;
        const user = await User.findOne({ _id: id });

        const currentDate = new Date().toISOString();

        const cart = await Cart.findOne({ userId: id }).populate({ path: 'products', populate: { path: 'productId', populate: { path: 'category',populate:{path:'offer'} } } }).populate({path:'couponApplyd' ,  populate:{path: 'couponId'}});
        const coupons = await Coupon.find({ 'user.userId': { $ne: id }, expiryDate: { $gte: currentDate } });
        res.render('checkout', { user, cart, coupons });
    } catch (error) {
        console.log(error);
    }
}


const checkoutAddAddress = async (req, res) => {
    try {
        const id = req.session.user._id;
        const { name, state, city, pin, phone } = req.body;
        await User.findOneAndUpdate({ _id: id }, {
            $push: {
                address: {
                    name: name,
                    state: state,
                    city: city,
                    pin: pin,
                    phone: phone
                }
            }
        });
        res.redirect('/checkout')

    } catch (error) {
        console.log(error);
    }
}

const placeOrder = async (req, res) => {
    try {
        const { index, payment, subTotal, couponCod } = req.body;
        const userId = req.session.user._id;
        const userCart = await Cart.findOne({ userId: userId }).populate('products.productId');
        const products = userCart.products;
        let quantityLess = 0;
        products.forEach((product) => {
            if (product.productId.stok <= 0) {
                quantityLess = product.productId.name;
            }
        });
        if (quantityLess) {
            res.json({ quan: true, quantityLess })
        } else {
            const user = await User.findOne({ _id: userId });
            const coupon = await Coupon.findOne({ couponCod: couponCod });
            const status = payment == 'COD' ? 'placed' : 'pending';
            const address = user.address[index];
            const date = Date.now();
            const orderid = generateRandomId();
            let orders;
            if (coupon == null) {
                orders = new Order({
                    userId: userId,
                    orderId: orderid,
                    products: products,
                    totalAmount: subTotal,
                    date: date,
                    status: status,
                    paymentMethod: payment,
                    deliveryAddress: address,

                });
            } else {
                orders = new Order({
                    userId: userId,
                    orderId: orderid,
                    products: products,
                    totalAmount: subTotal - userCart.couponApplyd.couponDiscount,
                    date: date,
                    status: status,
                    paymentMethod: payment,
                    deliveryAddress: address,
                    couponUsed: coupon._id
                });

            }
            const orderDetails = await orders.save();
            const orderId = orderDetails.orderId;
            await Coupon.updateOne({ couponCod: couponCod }, { $push: { user: { userId: userId } } })

            //  COD PAYMENT 
            if (orderDetails.paymentMethod == 'COD') {
                await Cart.deleteOne({ userId: userId });
                for (i = 0; i < products.length; i++) {
                    const productId = products[i].productId;
                    const productQuantity = products[i].quantity;
                    await Product.updateOne({ _id: productId }, { $inc: { stock: -productQuantity } })

                }
                const orderId = orderDetails.orderId;
                const order = await Order.findOne({ orderId: orderId })
                await Order.findOneAndUpdate({ orderId: orderDetails.orderId, }, {
                    $set: { "products.$[].status": "placed" }
                })
                res.json({ ok: true, orderId });
            }
            // RAZORPAY PAYMENT 
            else if (orderDetails.paymentMethod == "RAZORPAY") {
                const options = {
                    amount: subTotal * 100,
                    currency: "INR",
                    receipt: "" + orderId,
                };
                instance.orders.create(options, (error, order) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: "Error creating Razorpay order" });
                    }
                    return res.json({ okk: true, order });
                })

            }                // WALLET
            else if (orderDetails.paymentMethod == "WALLET") {
                let wallet = await Wallet.findOne({ userId: userId });
                if (wallet.balance >= subTotal - userCart.couponDiscount) {
                    wallet.balance -= subTotal - userCart.couponDiscount;
                    wallet.walletHistory.push({
                        amount: subTotal,
                        type: "Debit",
                        reason: "Order Payment",
                        orderId: orders._id,
                        orderId2: orderid,
                        date: new Date()
                    });
                    await wallet.save();
                    paymentStatus = 'success'

                    await Order.findOneAndUpdate({ orderId: orderDetails.orderId, }, {
                        $set: { "products.$[].status": "placed" }
                    })

                    await Cart.deleteOne({ userId: userId });

                    for (i = 0; i < products.length; i++) {
                        const productId = products[i].productId;
                        const productQuantity = products[i].quantity;
                        await Product.updateOne({ _id: productId }, { $inc: { stock: -productQuantity } });
                        res.json({ wallet: true, orderId });
                    }
                } else {
                    res.json({ balance: true });
                }

            } else {

            }
        }

    } catch (error) {
        console.log(error);
    }
}

const verifyPayment = async (req, res) => {
    const { paymetn, order } = req.body;
    const userId = req.session.user._id;
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(paymetn.razorpay_order_id + '|' + paymetn.razorpay_payment_id);
    const hmacValue = hmac.digest("hex");
    if (hmacValue == paymetn.razorpay_signature) {
        const cart = await Cart.findOne({ userId: userId }).populate('products.productId');
        const products = cart.products;
        for (i = 0; i < products.length; i++) {
            let productId = products[i].productId;
            let productQuantity = products[i].quantity;
            await Product.updateOne({ _id: productId }, { $inc: { stock: -productQuantity } });
        }
        await Order.findOneAndUpdate({
            orderId: order.receipt,
            "products.productId": { $in: products.map(product => product.productId) },
        }, {
            $set: {
                status: "placed",
                "products.$[].status": "placed",
                paymentId: paymetn.razorpay_payment_id,
            }
        });
        await Cart.deleteOne({ userId: userId });
        const orderId = order.receipt
        res.json({ paymentSuccess: true, orderId });
    }
}


const paymentCountinue = async(req,res)=>{
    try {
        const { orderId } = req.body;
        const order = await Order.findOne({ orderId: orderId }).populate('userId');

        const option = {
            amount: order.totalAmount * 100,
            currency: "INR",
            receipt: "" + order.orderId,
        };

        instance.orders.create(option, function (err, order) {
            if (err) {
                // Handle the error appropriately
                console.error("Error creating order:", err);
                res.status(500).json({ error: "Failed to create order" });
                return;
            }
            res.json({ order: order });
        });

    } catch (error) {
        console.log(error);
    }
}





const applyCoupon = async (req, res) => {
    try {
        const { couponcod, subtotal } = req.body;
        let discountAmount;
        const userId = req.session.user._id;
        const coupon = await Coupon.findOne({ couponCod: couponcod });
        if (coupon) {
            if (coupon.type == "amount") {
                discountAmount = coupon.discount;
            } else {
                discountAmount = subtotal * (coupon.discount / 100);
            }
            await Cart.findOneAndUpdate({ userId: userId }, {
                $set: {
                    couponApplyd: {
                        couponId: coupon._id,
                        couponDiscount: discountAmount
                    }
                }
            })
            res.json({ ok: true, coupon });
        } else {
            res.json({ notFount: true })
        }


    } catch (error) {
        console.log(error);
    }
}

const removeCoupon = async (req, res) => {
    try {
        const id = req.session.user._id
        await Cart.findOneAndUpdate({ userId: id }, {
            $unset: { couponApplyd: 1 }
        })

        res.json({ ok: true });

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadCheckout,
    placeOrder,
    checkoutAddAddress,
    verifyPayment,
    paymentCountinue,
    applyCoupon,
    removeCoupon

}