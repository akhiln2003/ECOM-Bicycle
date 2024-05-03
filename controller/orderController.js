const Product = require('../models/productModel');
const User = require('../models/userModel');
const Orders = require('../models/orderModel');
const Coupon = require('../models/couponModel');
const Wallet = require('../models/walletModel');
const { findOneAndUpdate } = require('../models/cartModel');




const loadOrderSuccess = async (req, res) => {
    try {
        const orderId = req.params.id;
        res.render('orderSuccess', { orderId });
    } catch (error) {
        console.log(error);
    }
}

const loadOrderDetails = async (req, res) => {
    try {
        const orderId = req.query.id;
        const userId = req.session.user._id;
        const order = await Orders.findOne({ userId: userId, orderId: orderId })
        let orders;
        if (order.couponUsed) {

            orders = await Orders.findOne({ userId: userId, orderId: orderId }).populate('products.productId').populate("userId").populate('couponUsed');
        } else {
            orders = await Orders.findOne({ userId: userId, orderId: orderId }).populate('products.productId').populate("userId");
        }
        res.render('orderDetails', { orders });
    } catch (error) {
        res.render('error404')
        console.log(error);
    }
}


const cancelOrder = async (req, res) => {
    try {
        const { productId, productid, orderId, resion } = req.body;
        let existOffer,existsCategoryOffer;
        const order = await Orders.findOneAndUpdate({ _id: orderId, 'products._id': productId }, { $set: { 'products.$.status': 'cancelled', 'products.$.cancelReason': resion } });
        const quantity = order.products[0].quantity;
        await Product.findOneAndUpdate({ _id: productid }, { $inc: { stock: quantity } })
        if (order.paymentMethod !== "COD") {
            let findProduct = await Product.findOne({ _id: productid }).populate('category');
            let product;
            if (findProduct.offer && findProduct.category.offer) {
                existOffer = true
                existsCategoryOffer = true
                product = await Product.findOne({ _id: productid }).populate('offer').populate({ path: 'category', populate: { path: 'offer' } });

            } else if (findProduct.category.offer && !findProduct.offer) {

                existsCategoryOffer = true
                product = await Product.findOne({ _id: productid }).populate({ path: 'category', populate: { path: 'offer' } });
            } else if (!findProduct.category.offer && findProduct.offer) {
                existOffer = true
                product = await Product.findOne({ _id: productid }).populate('offer');
            } else {
                product = await Product.findOne({ _id: productid });
            }

            if (existOffer && existsCategoryOffer) {
                if (product.offer.offerPercentage < product.category.offer.offerPercentage) {
                    productPrice = product.category.offer.offerPercentage
                } else {
                    productPrice = product.offer.offerPercentage

                }
            } else if (!existOffer && existsCategoryOffer) {

                productPrice = product.category.offer.offerPercentage
            } else if (existOffer && !existsCategoryOffer) {
                productPrice = product.offer.offerPercentage

            } else {
                productPrice = product.productPrice

            }
            const wallet = await Wallet.findOne({ userId: req.session.user._id });
            if(productPrice ==  product.productPrice){
                wallet.balance += product.productPrice
                wallet.walletHistory.push({
                    amount: product.productPrice - (product.productPrice * (productPrice / 100)),
                    type: 'Credit',
                    reason: `Order calcel refund`,
                    orderId: orderId,
                    orderId2: order.orderId,
                    date: new Date()
                });
                await wallet.save();
            }else{

                wallet.balance += product.productPrice - (product.productPrice * (productPrice / 100));
                wallet.walletHistory.push({
                    amount: product.productPrice - (product.productPrice * (productPrice / 100)),
                    type: 'Credit',
                    reason: `Order calcel refund`,
                    orderId: orderId,
                    orderId2: order.orderId,
                    date: new Date()
                });
                await wallet.save();
            }
        }
        res.json({ ok: true });
    } catch (error) {
        console.log(error);
    }
}

const returnOrder = async (req, res) => {
    try {
        const { productId, productid, orderId, resion } = req.body;
        await Orders.findOneAndUpdate({ _id: orderId, 'products._id': productId }, { $set: { 'products.$.status': 'returnRequested', 'products.$.returnReason': resion } });
        res.json({ ok: true })
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