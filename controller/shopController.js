const Product = require('../models/productModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Whishlist = require('../models/whishListModel');
const Category = require('../models/category');
const { isDeleted } = require('./categoryController');
const products = require('../models/productModel');


// SHOP
const loadShop = async (req, res) => {
    try {
        let page = 1;
        if (req.query.page > 0) {
            page = parseInt(req.query.page)
        }


        let previous = page > 1 ? page - 1 : 1;
        let limit = 10;
        let coutn = await Product.find({ isDeleted: false }).count();
        let totalPages = Math.ceil(coutn / limit);
        let next = page < totalPages ? page + 1 : totalPages

        const category = await Category.find({ isDeleted: false });
        let products;
        if (req.query.sort && !req.query.category ) {
            if (req.query.sort == "Aa-Zz") {
                products = await Product.find({ isDeleted: false }).populate('category').sort({ productName: 1 }).limit(limit).skip((page - 1) * limit).exec();
            } else if (req.query.sort == "Low-High") {
                products = await Product.find({ isDeleted: false }).populate('category').sort({ productPrice: 1 }).limit(limit).skip((page - 1) * limit).exec();
            } else if (req.query.sort == "High-Low") {
                products = await Product.find({ isDeleted: false }).populate('category').sort({ productPrice: -1 }).limit(limit).skip((page - 1) * limit).exec();
            } else if (req.query.sort == "NewArivals") {
                products = await Product.find({ isDeleted: false }).populate('category').sort({ dateJoined: 1 }).limit(limit).skip((page - 1) * limit).exec();
            }
        } else if (!req.query.sort && req.query.category  ) {
            const category = await Category.find({ isDeleted: false, categoryName: req.query.category });
            products = await Product.find({ isDeleted: false, category: category[0]._id }).populate('category')



        } else if (req.query.sort && req.query.category  ) {
            if (req.query.sort == "Aa-Zz") {
                const category = await Category.find({ isDeleted: false, categoryName: req.query.category });
                products = await Product.find({ isDeleted: false, category: category[0]._id }).populate('category').sort({ productName: 1 }).limit(limit).skip((page - 1) * limit).exec();
            } else if (req.query.sort == "Low-High") {
                const category = await Category.find({ isDeleted: false, categoryName: req.query.category });
                products = await Product.find({ isDeleted: false, category: category[0]._id }).populate('category').sort({ productPrice: 1 }).limit(limit).skip((page - 1) * limit).exec();
            } else if (req.query.sort == "High-Low") {
                const category = await Category.find({ isDeleted: false, categoryName: req.query.category });
                products = await Product.find({ isDeleted: false, category: category[0]._id }).populate('category').sort({ productPrice: -1 }).limit(limit).skip((page - 1) * limit).exec();
            } else if (req.query.sort == "NewArivals") {
                const category = await Category.find({ isDeleted: false, categoryName: req.query.category });
                products = await Product.find({ isDeleted: false, category: category[0]._id }).populate('category').sort({ dateJoined: 1 }).limit(limit).skip((page - 1) * limit).exec();
            }

        }  else {
            console.log("else");
            products = await Product.find({ isDeleted: false }).populate('category').limit(limit).skip((page - 1) * limit).exec();
        }



        res.render('shop', { products, category, next, previous, totalPages });
    } catch (error) {
        console.log(error);
    }
}


//  PRODUCT DETAILS
const loadProductDetails = async (req, res) => {
    try {
        const productId = req.query.id;
        const userId = req.session.user._id;
        let product
        let existOffer =false ;
        let existsCategoryOffer = false;
        let findProduct = await Product.findOne({ _id: productId }).populate('category');
        if(findProduct.offer && findProduct.category.offer){
            existOffer = true 
            existsCategoryOffer =true
            product = await Product.findOne({ _id: productId }).populate('offer') .populate({ path: 'category',  populate: { path: 'offer' }   });
            
                }else if(findProduct.category.offer && !findProduct.offer){
                    existsCategoryOffer =true
                    product = await Product.findOne({ _id: productId }).populate({ path: 'category',  populate: { path: 'offer' }   });

        }else if(!findProduct.category.offer && findProduct.offer){
            existOffer = true 
            product =  await Product.findOne({ _id: productId }).populate('offer');
        }else{

            product =  await Product.findOne({ _id: productId });
        }
        const user = await User.findOne({ _id: userId });
        const category = product.category;
        const relatedProduct = await Product.find({ category: category });
        let inCart, inWhishlist;

        if (user) {
            const existscart = await Cart.findOne({ userId: userId });
            const existswhishlist = await Whishlist.findOne({ userId: userId });
            if (existscart) {
                const existsProduct = await existscart.products.find((product) => product.productId.toString() == productId);
                if (existsProduct) {
                    inCart = true
                }
            }
            if (existswhishlist) {
                const existsProduct = await existswhishlist.products.find((product) => product.productId.toString() == productId);
                if (existsProduct) {
                    inWhishlist = true
                }

            }
        }
        res.render('productDetails', { product, relatedProduct, inCart, inWhishlist , existOffer,existsCategoryOffer });
    } catch (error) {
        res.render('error404')
        console.log(error);
    }
}


const searchProduct= async(req,res)=>{
    try {
       const {searchName,listedCategory} = req.body;
       const regexPattern = new RegExp(`^${searchName}`, 'i');
       let products;
       if(listedCategory){
        const category = await Category.findOne({categoryName:listedCategory});
        const categoryId = category._id;

        products = await Product.find({ productName: { $regex: regexPattern },category:categoryId });  

       }else{

        products = await Product.find({ productName: { $regex: regexPattern } });  

       }
       return res.status(200).json({ message: "interanl " });

    } catch (error) {
        
        console.log(error);
    }
}


module.exports = {
    loadShop,
    loadProductDetails,
    searchProduct
}