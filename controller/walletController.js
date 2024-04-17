const Wallet = require('../models/walletModel');

const loadWallet = async(req,res)=>{
    try {
        const id = req.session.user._id;
        const wallet = await Wallet.findOne({userId:id})
        res.render('wallet',{wallet});
    } catch (error) {
        console.log(error);
    }
}

module.exports ={
    loadWallet
}