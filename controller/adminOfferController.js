const offer = require('../models/offerModel');
const Offer = require('../models/offerModel');
const { isDeleted } = require('./categoryController');

const loadOffer = async (req, res) => {
    try {
        const offer = await Offer.find({ isDeleted: false });
        res.render('offer', { offer });
    } catch (error) {
        console.log(error);
    }
}

const loadAddOffer = async (req, res) => {
    try {
        res.render('addOffer');
    } catch (error) {
        console.log(error);
    }
}

const addOffer = async (req, res) => {
    try {
        const { name, percentage, expirydate } = req.body;
        const exist = await Offer.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') }, isDeleted: false });
        if (exist) {
            req.flash('existOffer', "Already exists a offer with this name");
            res.redirect('/admin/addoffer');
        } else {
            const offer = new Offer({
                name: name,
                offerPercentage: percentage,
                expiryDate: expirydate
            });
            await offer.save();
            res.redirect('/admin/offer');
        }

    } catch (error) {
        console.log(error);
    }
}

const loadEditoffer = async (req, res) => {
    try {
        const id = req.query.id;
        const offer = await Offer.findOne({ _id: id });
        res.render('editOffer', { offer })
    } catch (error) {
        console.log(error);
    }
}

const editOffer = async (req, res) => {
    try {
        const { id, name, percentage, expirydate } = req.body;
        const exist = await Offer.findOne({ _id: { $ne: id }, name: name });
        if (exist) {
            req.flash('exists', "offer alredy exists with this name ");
            res.redirect(`/admin/editoffer?id=${id}`);
        } else {
            await Offer.updateOne({ _id: id }, {
                $set: {
                    name: name,
                    offerPercentage: percentage,
                    expiryDate: expirydate
                }
            });
            res.redirect('/admin/offer');

        }
    } catch (error) {
        console.log(error);
    }
}

const deleteOffer = async(req,res)=>{
    try {
        const {id} = req.body;
        await Offer.findOneAndUpdate({_id:id},{
            $set:{
                isDeleted:true
            }
        })
        res.json({ ok: true });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadOffer,
    loadAddOffer,
    addOffer,
    loadEditoffer,
    editOffer,
    deleteOffer
}