
const User = require('../models/userModel');

        //customers listing
        const loadCustomers = async(req,res)=>{
            try {
                const users = await User.find();
                res.render('customers',{users:users});
        
            } catch (error) {
                console.log(error);
            }
         }
        
                //Bblock and Unblock customers
        const blockUser = async(req,res)=>{
            try {
                const  id= req.body.id;
              const user = await User.findOne({_id:id});
              if(user.blocked){
                await User.updateOne({_id:id},{$set:{blocked:false}});
              }else{
                await User.updateOne({_id:id},{$set:{blocked:true}});
              }
              res.json({blocked:true});
            } catch (error) {
                console.log(error);
            }
        }
        
module.exports ={
    loadCustomers,
    blockUser,
}
        