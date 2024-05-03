const User = require('../models/userModel');


const isBlocked = async (req, res, next) => {
    try {
        const usesrId = req.session.user._id;
        const user = await User.findById(usesrId);
        if (user.blocked == true) {
            req.flash('exists', "This user is blocked in this site");
            res.redirect('/login');
        } else {
            next()
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = isBlocked