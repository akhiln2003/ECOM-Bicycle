const session = require('express-session');
const User = require('../models/userModel');
const Orders = require('../models/orderModel')
const bcrypt = require('bcryptjs');
const { response } = require('express');
const nodemailer = require('nodemailer');
const userOtpVerification = require('../models/userOTPVerification');



// Send OTP for profile email change
const sendOtpVerificationMail = async (emailData, res, type) => {
    try {
        const { email, userId } = emailData;
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service: "Gmail",
            auth: {
                user: "4khiln@gmail.com",
                pass: "ppgh vmmx ogtb gljy"
            }
        });

        // Create OTP
        const createdOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
        console.log(createdOtp);

        const mailOption = {
            from: "4khiln@gmail.com",
            to: email,
            subject: "OTP Verification for Email Change",
            html: `Your OTP for email change is ${createdOtp}`
        };

        const hashedOtp = await bcrypt.hash(createdOtp, 10);
        const newOtpVerification = await new userOtpVerification({ email: email, otp: hashedOtp });
        await newOtpVerification.save();

        await transporter.sendMail(mailOption);
        res.redirect(`/otp?email=${email}&type=changeEmail&userId=${userId}`);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
}



// Load profile

const loadProfile = async (req, res) => {
    try {
        const id = req.session.user._id;
        const user = await User.findOne({ _id: id });
        res.render('profile', { user });
    } catch (error) {
        console.log(error);
    }
}

// Load Address

const loadAddress = async (req, res) => {
    try {
        const id = req.session.user._id;
        const user = await User.findOne({ _id: id });
        res.render('address', { user });
    } catch (error) {
        console.log(error);
    }
}

//  Load Edit Profile

const loadEditprofile = async (req, res) => {
    try {
        const id = req.query.id;
        const user = await User.findOne({ _id: id })
        res.render('editProfile', { user });
    } catch (error) {
        console.log(error);

    }
}

// Update profiel

const updateProfile = async (req, res) => {
    try {
        const { id, editName, editEmail } = req.body;
        
        // Validate inputs
        if (!id || !editName || !editEmail) {
            req.flash('error', "All fields are required");
            res.redirect(`/editProfile?id=${id}`);
            return;
        }

        const user = await User.findOne({ _id: id });
        if (!user) {
            req.flash('error', "User not found");
            res.redirect(`/editProfile?id=${id}`);
            return;
        }

        // Check if name already exists (excluding current user)
        const existname = await User.findOne({ _id: { $ne: id }, name: editName });
        if (existname) {
            req.flash('error', "Name is already existed");
            res.redirect(`/editProfile?id=${id}`);
            return;
        }

        // Trim and validate email
        const trimmedEmail = editEmail.trim();
        
        // Check if email is being changed
        if (trimmedEmail.toLowerCase() !== user.email.toLowerCase()) {
            // Check if new email already exists (case-insensitive)
            const existEmail = await User.findOne({ 
                _id: { $ne: id }, 
                email: { $regex: `^${trimmedEmail}$`, $options: 'i' } 
            });
            
            if (existEmail) {
                req.flash('error', "This email is already registered. Please use a different email.");
                res.redirect(`/editProfile?id=${id}`);
                return;
            }

            // Update name first
            await User.findOneAndUpdate({ _id: id }, { name: editName });

            // Send OTP for email change
            req.session.tempEmail = trimmedEmail;
            req.session.tempUserId = id;
            console.log('Sending OTP for email change to:', trimmedEmail);
            await sendOtpVerificationMail({ email: trimmedEmail, userId: id }, res, 'changeEmail');
        } else {
            // Only name changed, update directly
            await User.findOneAndUpdate({ _id: id }, { name: editName });
            req.flash('success', "Profile updated successfully");
            res.redirect('/profile');
        }

    } catch (error) {
        console.log(error);
        req.flash('error', 'An error occurred while updating profile');
        res.redirect(`/editProfile?id=${req.body.id}`);
    }
}
// Lod Change Password 

const loadChangepassword = async (req, res) => {
    try {
        res.render('changePassword');
    } catch (error) {
        console.log(error);
    }
}

//Chandge Password

const changePassword = async (req, res) => {
    try {
        const { id, current, newPassword } = req.body;
        const user = await User.findOne({ _id: id });
        const password = user.password;
        const compare = await bcrypt.compare(current, password);
        if (compare) {
            const securePasswor = await bcrypt.hash(newPassword, 10);
            await User.findOneAndUpdate({ _id: id }, { $set: { password: securePasswor } });
            res.redirect('/profile');
        } else {
            req.flash('error', "Current Password is not currect");
            res.redirect('/changePassword');
        }

    } catch (error) {
        console.log(error);
    }
}

// Add Prodict 

const loadAddaddress = async (req, res) => {
    try {
        res.render('addAddress');
    } catch (error) {
        console.log(error);
    }
}

// insert Address

const insertAddress = async (req, res) => {
    try {
        const id = req.session.user._id;
        const { name, state, city, pin, phone } = req.body;
        await User.findOneAndUpdate({ _id: id }, {
            $push: {
                address: {
                    name: name,
                    state: state,
                    city: city,
                    pin: pin,
                    phone: phone
                }
            }
        });
        res.redirect('/address')

    } catch (error) {
        console.log(error);
    }
}


const deletAddress = async (req, res) => {
    try {
        const { userid, addressid } = req.body;
        await User.findOneAndUpdate({ _id: userid }, { $pull: { address: { _id: addressid } } });
        res.redirect('/address');

    } catch (error) {
        console.log(error);
    }
}

const loadEditaddress = async (req, res) => {
    try {

        const index = req.query.index
        const userid = req.session.user._id;
        const user = await User.findOne({ _id: userid });
        const userAddress = user.address[index]
        res.render('editAddress', { user, index, userAddress });
    } catch (error) {
        console.log(error);
    }
}

const updatEditaddress = async (req, res) => {
    try {
        const { id, index, name, state, city, pin, phone } = req.body;
        await User.findOneAndUpdate({ _id: id }, {
            $set: {
                [`address.${index}.name`]: name,
                [`address.${index}.state`]: state,
                [`address.${index}.city`]: city,
                [`address.${index}.pin`]: pin,
                [`address.${index}.phone`]: phone

            }
        })
        res.redirect('/address')
    } catch (error) {
        console.log(error);
    }
}

const loadOrHistory = async (req, res) => {
    try {
        const id = req.session.user._id;
        let page = 1;

        if (req.query.page) {
            page = parseInt(req.query.page);
        }

        let limit = 8;
        let count = await Orders.countDocuments({ userId: id });
        let totalPages = Math.ceil(count / limit);
        let next = page < totalPages ? page + 1 : totalPages;
        let previous = page > 1 ? page - 1 : 1;

        const orders = await Orders.find({ userId: id }).sort({ date: -1 }).limit(limit).skip((page - 1) * limit);

        res.render('orderHistory', { orders, next, previous, totalPages });
    } catch (error) {
        console.log(error);
    }
}


const loadInvoice = async (req, res) => {
    try {
        const id = req.query.id
        let orders;
        const order = await Orders.findOne({ _id: id });
        if (order.couponUsed) {
            orders = await Orders.findOne({ _id: id }).populate('products.productId').populate('couponUsed');
        } else {
            orders = await Orders.findOne({ _id: id }).populate('products.productId');
        }
        const user = await User.findOne({ _id: req.session.user._id });
        const email = user.email;
        res.render('invoice', { orders, email });
    } catch (error) {
        console.log(error);
    }
}



// Check if email is available
const checkEmailAvailability = async (req, res) => {
    try {
        const { email, userId } = req.body;
        
        if (!email) {
            return res.json({ available: false, message: "Email is required" });
        }

        const trimmedEmail = email.trim();

        // Check if email exists (excluding current user)
        const existingUser = await User.findOne({ 
            _id: { $ne: userId }, 
            email: { $regex: `^${trimmedEmail}$`, $options: 'i' } 
        });

        if (existingUser) {
            return res.json({ available: false, message: "This email is already registered" });
        }

        return res.json({ available: true, message: "Email is available" });

    } catch (error) {
        console.log(error);
        return res.json({ available: false, message: "Error checking email availability" });
    }
}


// Verify OTP for email change
const verifyEmailOtp = async (req, res) => {
    try {
        const { email, userId, digit1, digit2, digit3, digit4 } = req.body;
        console.log('verifyEmailOtp called with:', { email, userId, digit1, digit2, digit3, digit4 });
        
        const otp = digit1 + digit2 + digit3 + digit4;

        const userVerification = await userOtpVerification.findOne({ email: email });

        if (!userVerification) {
            console.log('No user verification found for email:', email);
            return res.json({ error: "OTP verification data not found" });
        }

        console.log('Found user verification, comparing OTP');
        const { otp: hashedOtp } = userVerification;
        const validOtp = await bcrypt.compare(otp, hashedOtp);

        if (validOtp) {
            console.log('OTP is valid, updating email for user:', userId);
            // Update email
            const updatedUser = await User.findOneAndUpdate({ _id: userId }, { email: email }, { new: true });
            
            // Delete OTP verification record
            await userOtpVerification.deleteOne({ email: email });

            console.log('Email updated successfully for user:', userId);
            return res.json({ success: true, message: "Email updated successfully" });
        } else {
            console.log('OTP is invalid');
            return res.json({ incorrect: true, message: "OTP is incorrect" });
        }

    } catch (error) {
        console.log('Error in verifyEmailOtp:', error);
        return res.status(500).json({ error: 'An error occurred during OTP verification: ' + error.message });
    }
}


module.exports = {
    loadProfile,
    loadAddress,
    loadEditprofile,
    updateProfile,
    loadChangepassword,
    changePassword,
    loadAddaddress,
    insertAddress,
    deletAddress,
    loadEditaddress,
    updatEditaddress,
    loadOrHistory,
    loadInvoice,
    verifyEmailOtp,
    checkEmailAvailability

}