const Orders = require('../models/orderModel');
const Wallet = require('../models/walletModel');
const Product = require('../models/productModel');


// LOAD ORDERS
const loadOrders = async (req, res) => {
    try {
        let page = 1;
        if (req.query.page) {
            page = parseInt(req.query.page);
        }
        
        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        let query = {};
        if (search) {
            const users = await Orders.find().populate({
                path: 'userId',
                match: { email: { $regex: search, $options: 'i' } }
            }).select('_id');
            const userIds = users.filter(user => user.userId !== null).map(user => user._id);
            
            query = {
                $or: [
                    { 'deliveryAddress.name': { $regex: search, $options: 'i' } },
                    { _id: { $in: userIds } }
                ]
            };
        }

        let next = page + 1;
        let previous = page > 1 ? page - 1 : 1;
        let limit = 10;
        const count = await Orders.countDocuments(query);
        const totalPages = Math.ceil(count / limit);

        if (next > totalPages) {
            next = totalPages
        }

        const orders = await Orders.find(query).populate('userId').sort({ date: -1 }).limit(limit).skip((page - 1) * limit);
        res.render('orders', { orders, totalPages, next, previous, search });
    } catch (error) {
        console.log(error);
    }
}


// LOAD ORDER DETAILS
const loadOrderdetails = async (req, res) => {
    try {
        const orderId = req.query.id.trim();
        let order = await Orders.findById(orderId);
        if (order.couponUsed) {
            order = await Orders.findById(orderId).populate('products.productId').populate('userId').populate('couponUsed');
        } else {
            order = await Orders.findById(orderId).populate('products.productId').populate('userId');

        }
        res.render('adminOrderDetails', { order });
    } catch (error) {
        console.log(error);
    }
}

const cancelOrder = async (req, res) => {
    try {
        const { productId, orderId } = req.body;
        const order = await Orders.findOneAndUpdate(
            { _id: orderId, 'products._id': productId },
            { $set: { 'products.$.status': 'cancelled' } },
            { new: true }
        ).populate('couponUsed').populate('userId');

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

            const wallet = await Wallet.findOne({ userId: order.userId._id });

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
                    userId: order.userId._id,
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


const changeOrderStatus = async (req, res) => {
    try {
        const { orderId, productId, status } = req.body;
        await Orders.findOneAndUpdate({ _id: orderId, 'products._id': productId }, {
            $set: {
                'products.$.status': status
            }
        })
        res.json({ ok: true })
    } catch (error) {
        console.log(error);
    }
}


const loadReturn = async (req, res) => {
    try {
        let page = 1
        if (req.query.page) {
            page = req.query.page;
        }
        let limit = 10;
        let previous = page > 1 ? page - 1 : 1;
        const count = await Orders.find({ 'products.status': "returnRequested" }).count();
        const totalPages = Math.ceil(count / limit);
        let next = page > totalPages ? page + 1 : totalPages;

        const orders = await Orders.find({
            'products.status': {
                $in: ["returnRequested", "returned", "returnDenied"]
            }
        }).populate('products.productId').populate('userId');
        res.render('returnOrder', { orders, next, previous, totalPages });
    } catch (error) {
        console.log(error);
    }
}

const loadReturnDetails = async (req, res) => {
    try {
        const orderId = req.query.id.trim();
        const order = await Orders.findById(orderId).populate('userId').populate('products.productId');
        res.render('returnDetails', { order })
    } catch (error) {
        console.log(error);
    }
}

const changeReturnStatus = async (req, res) => {
    try {
        const { orderId, productId, status, userId, productid } = req.body;
        const order = await Orders.findOneAndUpdate({ _id: orderId, 'products._id': productId }, {
            $set: {
                'products.$.status': status
            }
        }).populate('couponUsed');

        if (status === "returned") {
            const returnedProduct = order.products.find(product => product._id.toString() === productId);
            if (!returnedProduct) {
                return res.status(404).json({ ok: false, message: 'Product not found in order' });
            }

            const productDetails = await Product.findById(returnedProduct.productId);
            if (!productDetails) {
                return res.status(404).json({ ok: false, message: 'Product details not found' });
            }

            let refundAmount = returnedProduct.price * returnedProduct.quantity;

            if (order.couponUsed && order.couponUsed.length > 0) {
                const coupon = order.couponUsed[0];
                const totalAmount = order.products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
                const discountRatio = (coupon.discountAmount / totalAmount);
                refundAmount -= refundAmount * discountRatio;
            }
            
            const wallet = await Wallet.findOne({ userId: userId });
            if (wallet) {
                wallet.balance += refundAmount;
                wallet.walletHistory.push({
                    amount: refundAmount,
                    type: 'Credit',
                    reason: 'Order return refund',
                    orderId: orderId,
                    orderId2: order.orderId,
                    date: new Date()
                });
                await wallet.save();
            } else {
                const newWallet = new Wallet({
                    userId: userId,
                    balance: refundAmount,
                    walletHistory: [{
                        amount: refundAmount,
                        type: 'Credit',
                        reason: 'Order return refund',
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
        res.status(500).json({ ok: false, message: 'An error occurred' });
    }
}



module.exports = {
    loadOrders,
    loadOrderdetails,
    cancelOrder,
    changeOrderStatus,
    loadReturn,
    loadReturnDetails,
    changeReturnStatus
}