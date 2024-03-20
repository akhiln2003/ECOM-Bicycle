
const passport = require('passport');
const User = require('../models/userModel');
const googleStatragy = require('passport-google-oauth2').Strategy;

passport.use(new  googleStatragy({
    clientID: process.env.googleCliendId ,
    clientSecret:process.env.googleCliendSecret ,
    callbackURL: process.env.googleCallbackURL,
    passReqToCallback:true
},(request,accessToken,refreshToken,profile,done)=>{
    return done(null,profile)
}
))

passport.serializeUser((user,done)=>{
    done(null,user)
})
passport.deserializeUser((user,done)=>{
    done(null,user)
})
