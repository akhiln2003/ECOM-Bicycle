
const Brand = require('../models/brandModel')

//Brand
const loadBrand = async (req, res) => {
    try {
        res.render('brands');
    } catch (error) {
        console.log(error);
    }
}

// Add Brand
const loadAddBrand = async (req, res) => {
    try {
        res.render('addBrand');
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    loadBrand,
    loadAddBrand

}