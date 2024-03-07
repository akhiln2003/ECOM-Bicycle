const User = require('../models/userModel');
const bcrypt = require('bcrypt');



            // Load profile
const loadProfile  =  async(req,res)=>{
    try {
        const id  = req.session.user._id;
        const user = await User.findOne({_id:id}) 
        res.render('profile',{user});
    } catch (error) {
        console.log(error);
    }
}

            // Load Address
const loadAddress = async(req,res)=>{
    try {
        const user  = req.session._id;
        res.render('address',{user});
    } catch (error) {
        console.log(error);
    }
}

            //  Load Edit Profile
const loadEditprofile = async (req, res) => {
    try {
       const id = req.query.id;
       const user = await User.findOne({_id:id})
       res.render('editProfile',{user});
    } catch (error) {
        console.log(error);
       
    }
}

            // Update profiel
const updateProfile = async(req,res)=>{
    try {
      const{id,editName,editPhone} = req.body;
      const existname = await User.findOne({_id:{$ne:id},name:editName});
      const existnumber = await User.findOne({_id:{$ne:id},mobile:editPhone});

      if(existname){
          req.flash('error',"Name is alredy existed");
          res.redirect(`/editProfile?id=${id}`);
        }if (existnumber) {
            req.flash('error',"nu   mber is alredy existed");
          res.redirect(`/editProfile?id=${id}`);
        }else{
         await User.findOneAndUpdate({_id:id},{name:editName,mobile:editPhone});
          res.redirect('/profile');
      }

      
    } catch (error) {
       
        console.log(error);
    }
}
        // Lod Change Password 
const loadChangepassword = async(req,res)=>{
    try {
        res.render('changePassword');
    } catch (error) {
        console.log(error);
    }
}

        //Chandge Password
const changePassword = async(req,res)=>{
    try {
        const {id,current,newPassword} = req.body;
        const user = await User.findOne({_id:id});
        const password  = user.password;
        const compare = await bcrypt.compare(current,password);
        if(compare){
            const securePasswor = await  bcrypt.hash(newPassword,10);
            await User.findOneAndUpdate({_id:id},{$set:{password:securePasswor}});
            res.redirect('/profile');
            }else{
                req.flash('error',"Current Password is not currect");
                res.redirect('/changePassword');
            }
         
    } catch (error) {
        console.log(error);
    }
}


const loadAddaddress = async(req,res)=>{
    try {
        res.render('addAddress');
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    loadProfile,
    loadAddress,
    loadEditprofile,
    updateProfile,
    loadChangepassword,
    changePassword,
    loadAddaddress
}