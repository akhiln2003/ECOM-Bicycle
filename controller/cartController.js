const Product =  require('../models/productModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const { logOut } = require('./userController');




        // Load Cart
const loadCart = async(req,res)=>{
    try {
        const id = req.session.user._id;
        const cart = await  Cart.findOne({userId:id}).populate('products.productId');
        res.render('cart',{cart});
    } catch (error) {
        console.log(error);
    }
}


        // Adding product to cart
const addtoCart = async(req,res)=>{
    try {
        const userId = req.session.user._id;
        const {productId,quantity}  = req.body;
        let price;
        const product  =  await Product.findOne({_id:productId}).populate('category');
        const cart = await Cart.findOne({userId:userId});
       if(cart){
        const existProduct = await  cart.products.find((product)=>product.productId == productId);
        if(existProduct){
            await Cart.findOneAndUpdate({userId:userId,'products.productId':productId},{
                $inc:{
                    'product.$.quantity':quantity,
                    'product.$.totalPrice':quantity *  existProduct.productPrice 
                }
            })
        }else{
            await Cart.findOneAndUpdate({userId:userId},{
                $push:{
                    products:{
                    productId:productId,
                    quantity:quantity,
                    pice:product.productPrice,
                    totalPrice:quantity * product.productPrice
                }
            }
            })
        }
       }else{
        const newCart = new Cart({
            userId:userId,
            products:[
                {
                    productId:productId,
                    quantity:quantity,
                    pice:product.productPrice,
                    totalPrice:quantity * product.productPrice
                }
            ]
        })
        await newCart.save();
       }
       res.json({ok:true});

    } catch (error) {
        console.log(error);
    }
}


                    //  Removing product in cart
const removeToCart = async(req,res)=>{
    try {
        const productId =  req.body.id;
        const userId = req.session.user._id;
        const userCart = await Cart.findOne({userId:userId});
        if(userCart){
            await Cart.findOneAndUpdate({userId:userId},{
                $pull:{
                    products:{productId:productId}
                }
            })
        }

        res.json({ok:true});

    } catch (error) {
        console.log(error);
    }
}

        // update quantity in cart
const updateQuantity = async(req,res)=>{
    try {
        const {productId,count} = req.body;
        const userId = req.session.user._id;
        const userCart = await Cart.findOne({userId:userId});
        const product = await Product.findOne({_id:productId}).populate('category');
        if(count == -1){
            
            const currentQuantity =  userCart.products.find((product)=>product.productId == productId).quantity;

            if(currentQuantity <= 1){
                return res.json({min:true});
            }
        }
        if(count == 1){
            const currentQuantity =  userCart.products.find((product)=>product.productId == productId).quantity;

            if(currentQuantity>= product.stock){
                return res.json({max:true});
            }else if(currentQuantity>= 5){
                return res.json({max:true});
            }
        }
        const productPrice = userCart.products.find((product)=>product.productId == productId).pice
        


        await Cart.findOneAndUpdate({userId:userId,'products.productId':productId},{
            $inc:{
                'products.$.quantity': count,
                'products.$.totalPrice': count * productPrice
            }
        })
        res.json({ok:true});
    } catch (error) {
        console.log(error);
    }
}


            //  Load Procced To Checkout page
const loadProccedToCheckout = async(req,res)=>{
    try {
        const id = req.session.user._id;
        const user = await User.findOne({_id:id});
        const cart  =  await Cart.findOne({userId:id}).populate('products.productId');
       res.render('checkout',{user,cart});
    } catch (error) {
        console.log(error);
    }
}


module.exports ={
    loadCart,
    addtoCart,
    removeToCart,
    updateQuantity,
    loadProccedToCheckout
}