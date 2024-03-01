                          
   const Category = require('../models/category'); 
          
        // Load List Category         
const loadCategory = async(req,res)=>{
        try {
            const category = await Category.find({});
            res.render('category',{category})
        } catch (error) {
            console.log(error);
        }
     }
            
            // Add Category
const loadAddcategory = async(rdq,res)=>{
        try {
            res.render('addCategory');
         } catch (error) {
            console.log(error);
         }
     }
 
         // insert Category
const insertCategory = async(req,res)=>{
    try {
        
        let {categoryName,description}=req.body;
        let existCategory = await Category.findOne({categoryName:categoryName,isDeleted:false});
        if(existCategory){
            req.flash('existCategory',"Already exists a category with this name");
            res.redirect('/admin/addcategory');
        }else{
            const category = new Category({
                categoryName:categoryName,
                description:description,
            });
                await category.save();
                res.redirect('/admin/category');
        }
    } catch (error) {
        console.log(error);
    }
}                                        

 
        // Load Edit Category
  
const loadEditcategory = async(req,res)=>{
    try {
        const id = req.query.id;
        const categoryEdit = await Category.findOne({_id:id});
        res.render('editCategory',{categoryEdit});

    } catch (error) {
        console.log(error);
    }
}

        //  updating catagory
 
const updateCategory = async(req,res)=>{
    const{id,categoryName,description} = req.body;

    const exist = await Category.findOne({categoryName:categoryName,isDeleted:false,_id:{$ne:id}});
    if(exist){  
        req.flash('existCategory',"Already exists a category with this name");
        res.redirect(`/admin/editcategory?id=${id}`);
    }else{
        await Category.findByIdAndUpdate({_id:id},{$set:{categoryName:categoryName,description:description}});
        res.redirect('/admin/category');
    }

}        

        // Delete category

const isDeleted = async(req,res)=>{
    try {
        const id = req.body.id;
        await Category.findOneAndUpdate({_id:id},{$set:{isDeleted:true}});
        res.json({deleted:true})

    } catch (error) {
        console.log(error);
    }
}
                                        
module.exports = {
    loadCategory,
    loadAddcategory,
    insertCategory,
    loadEditcategory,
    updateCategory,
    isDeleted,
}