const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer =require('nodemailer');
const userOtpVerification =require('../models/userOTPVerification');

    // loading Home
const loadHome = async(req,res)=>{
    try {
        const id = req.session.user;
        const user = await User.findOne({_id:id});
        res.render('home');
    } catch (error) {
        console.log(error);
    }
}
    
      // loading Login
const loadLogin = async(req,res)=>{
    try {   
        res.render('login');
    } catch (error) {
        console.log(error);
    }
}
    // password secur
const securePassword = async(password)=>{
    try {
        const securePass =  await bcrypt.hash(password,10);
        return securePass
    } catch (error) {
        console.log(error);
    }
}

     // loading Register
const loadRegister = async(req, res) => {
    try {
        res.render('registration');
    } catch (error) {
        console.log(error);
    }
}
   

       //  inserting  User
const insertuser = async(req,res)=>{

    try {
         const {email,name,mobile}=req.body;
        const findUserByEmale = await User.findOne({email:email});
        const findUserByName = await User.findOne({name:name});
        const findUserByMobile = await User.findOne({mobile:mobile});
        if (findUserByEmale) {
            req.flash('exists',"user alredy exists with this email ");
             res.redirect('/register');
            
        } else if  (findUserByName) {
            req.flash('exists',"this user name is not available");
             res.redirect('/register');
            
        } else if(findUserByMobile){
            req.flash('exists',"Alredy Use This Number");
             res.redirect('/register');
        } else if(req.body.password ===  req.body.ConformPassword){
            const securePass = await securePassword(req.body.password)
            const user  = new User({
                name:req.body.name,
                email:req.body.email,
                mobile:req.body.mobile,
                dateofbirth:req.body.dateofbirth,
                gender:req.body.gender,
                password:securePass,
            });
            
            await user.save();
            sendOtpVerificationMail(user,res);
         
        } else{
            req.flash('exits', 'Confirm your password')
            res.redirect('/register');
        }
    } catch (error) {
        console.log(error);
    }

}

    // Send OTP Verification
 const sendOtpVerificationMail = async({email},res)=>{
    try {
        const transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            secure:true,
            auth:{
                user:"4khiln@gmail.com",
                pass:"dvrv qguv lbeg ijpu"
            }

        });
                // creatin otp
        const createdOtp = `${Math.floor(1000+Math.random()*9000)}`;
        console.log(createdOtp);
        const mailOption = {
            from:"4khiln@gmail.com",
            to:email,
            subject:"OTP Verification",
            html:`Your OTP is ${createdOtp}`
        }

        const hashedOtp = await bcrypt.hash(createdOtp,10);
        const newOtpVerification = await new userOtpVerification({email:email,otp:hashedOtp});
        await newOtpVerification.save();
        res.redirect(`/otp?email=${email}`);
        await transporter.sendMail(mailOption);

    } catch (error) {
        console.log(error);
    }
 }
    //load Otp
 const loadOtp = async(req,res)=>{
    try {
        const email = req.query.email
        res.render('otp',{email:email})
    } catch (error) {
        console.log(error);
    }
 }
    // OTP verification
 const verifyOtp = async(req,res)=>{
    try {
       const email = req.body.email;
       const otp = req.body.digit1 + req.body.digit2 + req.body.digit3 + req.body.digit4;
       const userVerification = await userOtpVerification.findOne({email:email});


       if(!userVerification){
        req.flash('message',"user verification data not found");
        res.redirect(`/otp?email=${email}`);
        return;
       }
       const {otp: hashedOtp} =userVerification;
       const valedotp = await bcrypt.compare( otp ,hashedOtp);  
       if(valedotp){
        const userData = await User.findOne({email:email});
        if(userData){
            await User.findByIdAndUpdate({
                _id:userData._id
            },
            {
                $set:{
                    verified:true
                }
            });
        }
       }else{
        req.flash('expire',"Incorrect OTP");
        res.redirect(`/otp?email=${email}`);
       }
       const user = await User.findOne({email:email});
       await userOtpVerification.deleteOne({email:email});
       if(user.verified){
        if(!user.blocked){
            req.session.user={
                _id:user._id,
                name:user.name,
                email:user.email
            }
            res.redirect('/login');
        }else{
            req.flash('blocked',"you are blocked for this contact with admin");
            res.redirect(`/otp?email=${email}`);
        }
       }else{
        req.flash('incorrect',"OTP is nicorrect ");
        res.redirect(`/otp?email=${email}`);
       }
    } catch (error) {
        console.log(error);
    }
 }
    // login verification
 const verifyLogin = async(req,res)=>{
    try {
        const {email,password}=req.body;
    const user =  await User.findOne({email:email});
    if(user){
       if(user.verified){
        if(user.blocked){
            req.flash('exists',"This user is blocked in this site");
            res.redirect('/login');
        }else{
            const DBpassword = user.password;
            const comparePassword = await bcrypt.compare(password,DBpassword);
            if(comparePassword){
                req.session.user = {
                    _id:user._id,
                    name:user.name,
                    email:user.email
                }
                res.redirect('/')
            }else{
                req.flash('exists',"Incorrect Password");
                res.redirect('/login');
            }
        }
       }else{
        req.flash('exists',"user not verified");
        res.redirect('/login');
       }
    }else{
        req.flash('exists',"user not registered");
        res.redirect('/login');
    }
    } catch (error) {
        console.log(error);
    }
    
 }

module.exports = {
    loadHome,
    loadLogin,
    loadRegister,
    insertuser,
    loadOtp,
    verifyOtp,
    verifyLogin

}