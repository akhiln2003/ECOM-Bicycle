const Product = require('../models/productModel');
const Category = require('../models/category');
const sharp = require('sharp') ;

                          
                      
             
            // Load Products           
const loadProducts =  async(req,res)=>{
        try {
            let page = 1;
            if(req.query.page){
                page= parseInt(req.query.page);
            }
            
            let limit = 5;
            const count = await Product.countDocuments();
            const totalPages = Math.ceil(count / limit);
            let previous = page > 1 ? page-1:1;
            let next = page < totalPages ? page + 1 : totalPages;
            const category = await Category.find({});
            const product = await Product.find({}).populate('category').limit(limit).skip((page - 1) * limit);
            res.render('products',{category,product,totalPages,next,previous});
        } catch (error) {
            console.log(error);
        }
     }


           // Load Add Products
const loadAddproduct = async(req,res)=>{
        try {
            const category = await Category.find({});
            res.render('addProduct',{category});
        } catch (error) {
            console.log(error);
        }
    }

        // insert products
const addProducts = async(req,res)=>{
    try {
        const details = req.body;
        const files = req.files;
        let imagesArray = [];
        if(Array.isArray(req.files)){
            for(i=0;i<files.length;i++){
                imagesArray[i] =  req.files[i].filename;
            }
         }
            for(i=0;i<imagesArray.length;i++){
                await sharp('public/admin/assets/images/product/productImages/' + req.files[i].filename)
                .resize(500,500)
                .toFile('public/admin/assets/images/product/sharpedproduct/' + req.files[i].filename)
            }
                const product = new Product({
                    productName:details.productName,
                    productPrice:details.productPrice,
                    stock:details.productQuentity,
                    category:details.category,
                    description:details.description,
                    image:imagesArray
                });
                await product.save();
                res.redirect('/admin/products')
            

        
        
    } catch (error) {
        console.log(error);
    }
}                                        
        // Load Edit products
const loadEditproduct = async(req,res)=>{
        try {
            const id =  req.query.id;
            const product = await Product.findOne({_id:id}).populate('category');
            const category = await Category.find({});

            res.render('editProduct',{product,category});
        } catch (error) {
            res.render('error404')
            console.log(error);
        }
}
        // Edit products
const editProducts = async(req,res)=>{
    try {
        const{id,productName,productPrice,productQuentity,category,description}=req.body;
        const exist = await Product.findOne({_id:id});
        await Product.updateOne({_id:id},{
           $set: {productName:productName,
            productPrice:productPrice,
            stock:productQuentity,
            category:category,
            description:description
        }
            
        });

        const arrImage = [];
        for(i=0;i<req.files.length;i++){
            arrImage.push(req.files[i].filename);
        }
        for(i=0;i<arrImage.length;i++){
            await sharp('public/admin/assets/images/product/productImages/' + req.files[i].filename)
            .resize(500,500)
            .toFile('public/admin/assets/images/product/sharpedproduct/' + req.files[i].filename)
        }

        if(arrImage){
            const image1  = arrImage[0] || exist.image[0];
            const image2 = arrImage[1] || exist.image[1];
            const image3  =arrImage[2] || exist.image[2];
            const image4 = arrImage[3] || exist.image[3];
            await Product.findOneAndUpdate({_id:id},{
                $set:{
                    'image.0':image1,
                    'image.1':image2,
                    'image.2':image3,
                    'image.3':image4
            }})

        }else{

        }
        res.redirect('/admin/products');
       
    } catch (error) {
        console.log(error);
    }
}

const isDeleted = async(req,res)=>{
    try {
        const id  = req.body.id;
        await Product.findOneAndUpdate({_id:id},{$set:{isDeleted:true}});
        res.json({deleted:true})
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    loadProducts,
    loadAddproduct,
    addProducts,
    loadEditproduct,
    editProducts,
    isDeleted
}