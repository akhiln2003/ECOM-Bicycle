
const Category = require('../models/category');
const offer = require('../models/offerModel');

// Load List Category         
const loadCategory = async (req, res) => {
    try {
        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        let query = {};
        if (search) {
            query = {
                categoryName: { $regex: search, $options: 'i' }
            };
        }

        const category = await Category.find(query);
        res.render('category', { category, search });
    } catch (error) {
        console.log(error);
    }
}

// Add Category
const loadAddcategory = async (rdq, res) => {
    try {
        res.render('addCategory');
    } catch (error) {
        console.log(error);
    }
}

// insert Category
const insertCategory = async (req, res) => {
    try {

        let { categoryName, description } = req.body;
        let existCategory = await Category.findOne({ categoryName: categoryName, isDeleted: false });
        if (existCategory) {
            req.flash('existCategory', "Already exists a category with this name");
            res.redirect('/admin/addcategory');
        } else {
            const category = new Category({
                categoryName: categoryName,
                description: description,
            });
            await category.save();
            res.redirect('/admin/category');
        }
    } catch (error) {
        console.log(error);
    }
}


// Load Edit Category

const loadEditcategory = async (req, res) => {
    try {
        const id = req.query.id;
        const categoryEdit = await Category.findOne({ _id: id });
        res.render('editCategory', { categoryEdit });

    } catch (error) {
        res.render('error404');
        console.log(error);
    }
}

//  updating catagory

const updateCategory = async (req, res) => {
    try {
        const { id, categoryName, description } = req.body;
        const exist = await Category.findOne({ categoryName: { $regex: new RegExp(`^${categoryName}$`, 'i') }, isDeleted: false, _id: { $ne: id } });
        if (exist) {
            req.flash('existCategory', "Already exists a category with this name");
            res.redirect(`/admin/editcategory?id=${id}`);
        } else {
            await Category.findByIdAndUpdate({ _id: id }, { $set: { categoryName: categoryName, description: description } });
            res.redirect('/admin/category');
        }
    } catch (error) {

        console.log(error);
    }


}

// Delete category

const isDeleted = async (req, res) => {
    try {
        const id = req.body.id;
        await Category.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } });
        res.json({ deleted: true })

    } catch (error) {
        console.log(error);
    }
}


const loadOffers = async (req, res) => {
    try {
        const currentDate = new Date();
        const categoryId = req.query.id;
        const offers = await offer.find({ isDeleted: false , expiryDate:{$gte:currentDate }});
        res.render('applyCategoryOfferLiset', { offers, categoryId });
    } catch (error) {
        console.log(error);
    }
}

const applyOffer = async (req, res) => {
    try {
        const { offerId, categoryId } = req.body;
        await Category.findOneAndUpdate({ _id: categoryId }, {
            $set: {
                offer: offerId
            }
        });
        res.json({ ok: true });
    } catch (error) {
        console.log(error);
    }
}


const removeOffer = async (req, res) => {
    try {
        const { categoryId } = req.body
        await Category.findOneAndUpdate({ _id: categoryId }, {
            $unset: {
                offer: 1
            }
        });
        res.json({ ok: true });
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
    loadOffers,
    applyOffer,
    removeOffer
}