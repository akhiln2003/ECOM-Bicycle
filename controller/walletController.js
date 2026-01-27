const Wallet = require('../models/walletModel');
const User = require('../models/userModel');

const loadWallet = async (req, res) => {
    try {
        const id = req.session.user._id;
        const wallet = await Wallet.findOne({ userId: id });
        const user = await User.findById(id);
        res.render('wallet', { wallet, user });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadWallet
}