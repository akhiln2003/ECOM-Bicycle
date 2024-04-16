

const loadWallet = async(req,res)=>{
    try {
        res.render('wallet');
    } catch (error) {
        console.log(error);
    }
}

module.exports ={
    loadWallet
}