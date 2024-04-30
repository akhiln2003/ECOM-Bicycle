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
        let next = page + 1;
        let previous = page > 1 ? page - 1 : 1;
        let limit = 10;
        const count = await Orders.find().count();
        const totalPages = Math.ceil(count / limit);

        if (next > totalPages) {
            next = totalPages
        }

        const orders = await Orders.find().populate('userId').sort({ date: -1 }).limit(limit).skip((page - 1) * limit);
        res.render('orders', { orders, totalPages, next, previous });
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

// CANCEL ORDER
const cancelOrder = async (req, res) => {
    try {
        const { productId, orderId } = req.body;
        await Orders.findOneAndUpdate({ _id: orderId, 'products._id': productId }, {
            $set: {
                'products.$.status': 'cancelled'
            }
        });
        res.json({ ok: true })
    } catch (error) {
        console.log(error);
    }
}


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
        const { orderId, productId, status, userId , productid} = req.body;
       let order = await Orders.findOneAndUpdate({ _id: orderId, 'products._id': productId }, {
            $set: {
                'products.$.status': status
            }
        })
        if (status == "returned") {
            let existOffer,existsCategoryOffer,product,productPrice;
            let findProduct = await Product.findOne({ _id: productid }).populate('category');
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
             
            if(existOffer && existsCategoryOffer ){
                if(product.offer.offerPercentage < product.category.offer.offerPercentage){
                    productPrice = product.category.offer.offerPercentage
                }else{
                    productPrice = product.offer.offerPercentage

                }
            }else if(!existOffer && existsCategoryOffer ){
                
                productPrice = product.category.offer.offerPercentage
            }else if(existOffer && !existsCategoryOffer ){
                productPrice = product.offer.offerPercentage

            }else{
                productPrice = product.productPrice

            }
            const wallet = await Wallet.findOne({ userId: userId });
            wallet.balance += product.productPrice-(product.productPrice*(productPrice/100)) ;
            wallet.walletHistory.push({
                amount: product.productPrice-(product.productPrice*(productPrice/100)) ,
                type: 'Credit',
                reason: `Order ${status === 'Cancelled' ? 'cancellation' : 'return'} refund`,
                orderId: orderId,
                orderId2: order.orderId,
                date: new Date()
            });
            await wallet.save();
        }
        res.json({ ok: true })
    } catch (error) {
        console.log(error);
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