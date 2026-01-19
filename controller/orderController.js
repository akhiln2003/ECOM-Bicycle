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
        const { productId, orderId, resion } = req.body;
        const order = await Orders.findOneAndUpdate(
            { _id: orderId, 'products._id': productId },
            { $set: { 'products.$.status': 'cancelled', 'products.$.cancelReason': resion } },
            { new: true }
        ).populate('couponUsed');

        const cancelledProduct = order.products.find(p => p._id.toString() === productId);

        if (!cancelledProduct) {
            return res.status(404).json({ ok: false, message: "Product not found in order" });
        }

        await Product.findByIdAndUpdate(cancelledProduct.productId, { $inc: { stock: cancelledProduct.quantity } });

        if (order.paymentMethod !== "COD") {
            let refundAmount = cancelledProduct.price * cancelledProduct.quantity;

            if (order.couponUsed && order.couponUsed.length > 0) {
                const coupon = order.couponUsed[0];
                const totalAmount = order.products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
                const discountRatio = (coupon.discountAmount / totalAmount);
                refundAmount -= refundAmount * discountRatio;
            }

            const wallet = await Wallet.findOne({ userId: req.session.user._id });

            if (wallet) {
                wallet.balance += refundAmount;
                wallet.walletHistory.push({
                    amount: refundAmount,
                    type: 'Credit',
                    reason: 'Order cancellation refund',
                    orderId: orderId,
                    orderId2: order.orderId,
                    date: new Date()
                });
                await wallet.save();
            } else {
                const newWallet = new Wallet({
                    userId: req.session.user._id,
                    balance: refundAmount,
                    walletHistory: [{
                        amount: refundAmount,
                        type: 'Credit',
                        reason: 'Order cancellation refund',
                        orderId: orderId,
                        orderId2: order.orderId,
                        date: new Date()
                    }]
                });
                await newWallet.save();
            }
        }

        res.json({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, message: "An error occurred" });
    }
};

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