const User = require('../models/userModel');


const loadRegister = async(req, res) => {
    try {
        res.render('registration');
    } catch (error) {
        console.log(error);
    }
}

const loadLogin = async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error);
    }
}
  
const loadHome = async(req,res)=>{
    try {
        res.render('home');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadRegister,
    loadLogin,
    loadHome
}