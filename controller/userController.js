const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const userOtpVerification = require('../models/userOTPVerification');
const Token = require('../models/tokenModel');
const Wallet = require('../models/walletModel');
const Products = require('../models/productModel');
const Category = require('../models/category');
const Order = require('../models/orderModel');
const crypto = require('crypto');




// ABOUT AS 
const loadAboutas = async (req, res) => {
    try {
        res.render('about');
    } catch (error) {
        console.log(error);
    }
}

// CONTACT
const loadContact = async (req, res) => {
    try {
        res.render('contact');
    } catch (error) {
        console.log(error);
    }
}

// loading Home
const loadHome = async (req, res) => {
    try {
        const category = await Category.findOne({categoryName:"ACCESSORIES",isDeleted:false});
        let categoryId = category._id;
        const accessories = await Products.find({category:categoryId,isDeleted:false});


        const featuredProduct = await Products.find({isDeleted:false}).populate('category').sort({ productPrice: -1 }) .limit(5); 

        const topProducts = await Order.aggregate([
            { $match: { status: "placed" } },
            { $unwind: "$products" },
            { $match: { "products.status": "delivered" } },
            { $group: { _id: "$products.productId", quantity: { $sum: "$products.quantity" } } },
            { $sort: { quantity: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $project: {
                    _id: "$_id",
                    productName: { $arrayElemAt: ["$productDetails.productName", 0] },
                    productImg: { $arrayElemAt: ["$productDetails.image", 0] },
                    productPrice: { $arrayElemAt: ["$productDetails.productPrice", 0] },

                }
            }

        ]);

        const newArrivals = await Products.find({isDeleted:false}).sort({dateJoined:-1}).limit(6);

        res.render('home',{
            featuredProduct,
            accessories,
            topProducts,
            newArrivals
        
        });
    } catch (error) {
        console.log(error);
    }
}

// loading Login
const loadLogin = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error);
    }
}
// password secur
const securePassword = async (password) => {
    try {
        const securePass = await bcrypt.hash(password, 10);
        return securePass
    } catch (error) {
        console.log(error);
    }
}

// loading Register
const loadRegister = async (req, res) => {
    try {
        res.render('registration');
    } catch (error) {
        console.log(error);
    }
}


//  inserting  User
const insertuser = async (req, res) => {

    try {
        const { email, name } = req.body;
        const findUserByEmale = await User.findOne({ email: email });
        const findUserByName = await User.findOne({ name: name });
        if (findUserByEmale) {
            req.flash('exists', "user alredy exists with this email ");
            res.redirect('/register');

        } else if (findUserByName) {
            req.flash('exists', "this user name is not available");
            res.redirect('/register');

        } else if (req.body.password === req.body.ConformPassword) {
            const securePass = await securePassword(req.body.password)
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                dateofbirth: req.body.dateofbirth,
                gender: req.body.gender,
                password: securePass,
            });

            await user.save();

            const newWallet = new Wallet({ userId: user._id, balance: 0 });
            await newWallet.save();

            sendOtpVerificationMail(user, res);

        } else {
            req.flash('exits', 'Confirm your password')
            res.redirect('/register');
        }
    } catch (error) {
        console.log(error);
    }

}

// Send OTP Verification
const sendOtpVerificationMail = async ({ email }, res) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service: "Gmail",
            auth: {
                user: "4khiln@gmail.com",
                pass: "plla ijfe bibq evzc"
            }

        });
        // creatin otp
        const createdOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
        console.log(createdOtp);
        const mailOption = {
            from: "4khiln@gmail.com",
            to: email,
            subject: "OTP Verification",
            html: `Your OTP is ${createdOtp}`
        }

        const hashedOtp = await bcrypt.hash(createdOtp, 10);
        const newOtpVerification = await new userOtpVerification({ email: email, otp: hashedOtp });
        await newOtpVerification.save();
        res.redirect(`/otp?email=${email}`);
        await transporter.sendMail(mailOption);

    } catch (error) {
        console.log(error);
    }
}
//load Otp
const loadOtp = async (req, res) => {
    try {
        const email = req.query.email
        res.render('otp', { email: email })
    } catch (error) {
        console.log(error);
    }
}
// OTP verification
const verifyOtp = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.digit1 + req.body.digit2 + req.body.digit3 + req.body.digit4;
        const userVerification = await userOtpVerification.findOne({ email: email });


        if (!userVerification) {
            req.flash('message', "user verification data not found");
            res.redirect(`/otp?email=${email}`);
            return;
        }
        const { otp: hashedOtp } = userVerification;
        const valedotp = await bcrypt.compare(otp, hashedOtp);
        if (valedotp) {
            const userData = await User.findOne({ email: email });
            if (userData) {
                await User.findByIdAndUpdate({
                    _id: userData._id
                },
                    {
                        $set: {
                            verified: true
                        }
                    });
            }
        } else {
            return res.json({ incorrect: true });

        }
        const user = await User.findOne({ email: email });
        await userOtpVerification.deleteOne({ email: email });
        if (user.verified) {
            if (!user.blocked) {
                req.session.user = {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
                res.json({ incorrect: false });
            } else {
                req.flash('blocked', "you are blocked for this contact with admin");
                res.redirect(`/otp?email=${email}`);
            }
        } else {
            req.flash('incorrect', "OTP is nicorrect ");
            res.redirect(`/otp?email=${email}`);
        }
    } catch (error) {
        console.log(error);
    }
}
// login verification
const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
            if (user.verified) {
                if (user.blocked) {
                    req.flash('exists', "This user is blocked in this site");
                    res.redirect('/login');
                } else {
                    const DBpassword = user.password;
                    const comparePassword = await bcrypt.compare(password, DBpassword);
                    if (comparePassword) {
                        req.session.user = {
                            _id: user._id,
                            name: user.name,
                            email: user.email
                        }
                        res.redirect('/')
                    } else {
                        req.flash('exists', "Incorrect Password");
                        res.redirect('/login');
                    }
                }
            } else {
                req.flash('exists', "user not verified");
                res.redirect('/login');
            }
        } else {

            req.flash('exists', "user not registered");
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);
    }

}


const loadForgotPassword = async (req, res) => {
    try {
        res.render('forgotPassword');
    } catch (error) {
        console.log(error);
    }
}

const resetPass = async (email, res) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send('user with this email is not existing')
        }
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({ userId: user._id, token: crypto.randomBytes(32).toString("hex") });
            await token.save();
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "4khiln@gmail.com",
                pass: "dvrv qguv lbeg ijpu"
            }
        })
        const resetPage = `http://localhost:3000/resetPassword/${user._id}/${token.token}`

        const mailOption = {
            from: "4khiln@gmail.com",
            to: email,
            subject: "Verify your email ",
            html: `your reset password link is ${resetPage}`
        }

        await transporter.sendMail(mailOption);
    } catch (error) {
        console.log(error);
    }
}

const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        await resetPass(email, res);
        req.flash('newsuccess', 'Sent a reset password link to your email')
        res.redirect('/login')
    } catch (error) {
        console.log(error);
    }
}

const loadResetPass = async (req, res) => {
    try {
        const userid = req.params.id;
        const token = req.params.token;
        res.render('newPassword', { userId: userid, token: token })
    } catch (error) {
        console.log(error);
    }
}

const resetPassword = async (req, res) => {
    try {
        const userid = req.body.userId;
        const token = req.body.token;
        const confirmPassword = req.body.confirmpassword;
        const user = await User.findOne({ _id: userid });
        if (!user) {
            return res.status(400).send('Invalid Link or expired')
        }
        const { email } = user;
        const tok = await Token.findOne({ token: token, userId: userid })
        if (!tok) {
            return res.status(400).send('Invalid Link or expired')
        }
        const securePass = await securePassword(confirmPassword);
        await User.updateOne({ _id: userid }, { $set: { password: securePass } });
        req.flash('newsuccess', 'New Password added')
        res.redirect('/login')

    } catch (error) {
        console.log(error);
    }
}

const logOut = async (req, res) => {
    try {
        req.session.user = null;
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}


const googleLogin = async (req, res) => {
    try {
        const name = req.user.displayName;
        const email = req.user.email;
        const userAlready = await User.findOne({ email: email });
        if (userAlready) {
            if (userAlready.blocked == false) {
                req.session.user = userAlready;
                return res.redirect('/');
            }
            else {
                req.flash('exists', "This user is blocked in this site");
                res.redirect('/login');
            }

        } else {
            const user = new User({ name: name, email, verified: true });
            await user.save();
            const newWallet = new Wallet({ userId: user._id, balance: 0 });
            await newWallet.save();

            req.session.user = user;
            res.redirect('/');
        }

    } catch (error) {
        console.log(error);
    }
}










module.exports = {
    loadAboutas,
    loadContact,
    loadHome,
    loadLogin,
    loadRegister,
    insertuser,
    loadOtp,
    verifyOtp,
    verifyLogin,
    loadForgotPassword,
    forgotPassword,
    loadResetPass,
    resetPassword,
    logOut,
    googleLogin,


}