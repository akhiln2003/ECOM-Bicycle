const Orders  = require('../models/orderModel');

const loadSalesreport = async(req,res)=>{
    try {
        res.render('sales');
    } catch (error) {
        console.log(error);
    }
}

const listOrders = async(req,res)=>{
    try {
        const { start, end } = req.body;

        // Convert start and end dates to JavaScript Date objects
        const startDate = new Date(start);
        const endDate = new Date(end);
        
        // Adjust endDate to include the entire end day by setting the time to the end of the day
        endDate.setHours(23, 59, 59, 999);
        
        const orders = await Orders.find({date : {$gte : start, $lte : end}}).populate('userId').populate('products');

        res.render('listSales',{orders});
    } catch (error) {
        console.log(error);
    }
}


module.exports={
    loadSalesreport,
    listOrders
}