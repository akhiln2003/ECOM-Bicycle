const isLogin =async(req,res,next)=>{
    try {
        if(req.session.user_id){
            next()
        }else{
            res.redirect('/login')
        }
        
    } catch (error) {
        console.log(error);
    }
}

const isLogOut = async(req,res,next)=>{
    try {
        if(!req.session.user_id){
            next()
        }else{
            res.redirect('/')
        }
        
    } catch (error) {
        console.log(error);
    }
}




module.exports={
    isLogin,
    isLogOut,
}