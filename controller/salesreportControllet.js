const Orders = require('../models/orderModel');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const loadSalesreport = async (req, res) => {
    try {
        res.render('sales');
    } catch (error) {
        console.log(error);
    }
}

const listOrders = async (req, res) => {
    try {
        const { start, end, search } = req.query;

        let query = { "products.status": "delivered" };

        // Date filtering
        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);
            endDate.setHours(23, 59, 59, 999);
            query.date = { $gte: startDate, $lte: endDate };
        }

        // Search filtering
        if (search) {
            // To search by userId.name, we need to find user IDs matching the search term first.
            const ordersWithMatchingUsers = await Orders.find({ "products.status": "delivered" }).populate({
                path: 'userId',
                match: { name: { $regex: search, $options: 'i' } }
            }).select('_id');

            const orderIdsFromUserSearch = ordersWithMatchingUsers.filter(order => order.userId !== null).map(order => order._id);

            query.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { _id: { $in: orderIdsFromUserSearch } }
            ];
        }

        const orders = await Orders.find(query).populate('userId').populate('products.productId');
        res.render('listSales', { orders, search });
    } catch (error) {
        console.log(error);
    }
}

const dowloadExcel = async (req, res) => {
    try {
        const data = req.body; // Table data received from the request

                // Removing  "" in the array
        let filteredData = data.map(innerArray => {
            return innerArray.filter(item => item.trim() !== '');
          });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Users");

        // Define columns in the worksheet 
        worksheet.columns = [
            { header: "No", key: "no", width: 10 },
            { header: "NrderID", key: "orderID", width: 25 },
            { header: "Name", key: "name", width: 15 },
            { header: "Price & Quantity", key: "Price & Quantity", width: 15 },
            { header: "Total", key: "Total", width: 10 },
            { header: "Date", key: "Date", width: 15 },
            { header: "Payment Method", key: "Payment Method", width: 15 },
            { header: "Status", key: "Status", width: 15 },
        ];

        // Add data to the worksheet 
        filteredData.forEach(order => { worksheet.addRow(order); });

        // Generate a unique filename for the Excel file
        const generateUniqueID = () => {
            const currentTime = new Date();
            const uniqueID = `${currentTime.getHours()}${currentTime.getMinutes()}${currentTime.getSeconds()}${currentTime.getMilliseconds()}`;
            return uniqueID;
        };
        
        const fileName = `CYCLE_CRAFT_${generateUniqueID()}`;
        
        // Save the workbook to the user's home directory
        const userHomeDir = require('os').homedir();
        const filePath = path.join(userHomeDir, 'Downloads', `${fileName}.xlsx`);
        await workbook.xlsx.writeFile(filePath);

        res.json({ ok: true });

    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while generating the Excel file.");
    }
}


module.exports = {
    loadSalesreport,
    listOrders,
    dowloadExcel
}