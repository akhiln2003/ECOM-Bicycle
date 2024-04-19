const Coupon = require('../models/couponModel');



const loadCoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.render('coupon', { coupons });
    } catch (error) {
        console.log(error);
    }
}


const loadAddcoupon = async (req, res) => {
    try {

        res.render('addCoupon');
    } catch (error) {
        console.log(error);
    }
}


const addCoupon = async (req, res) => {
    try {
        const { couponName, expiryDate, limitOfUse, Discount, type } = req.body;
        const firstName = couponName.split('').splice(1, 3).join('')
        const randomString = Math.random().toString(36).substring(2, 7);
        const randomNumber = `${Math.floor(1000 + Math.random() * 9000)}`;
        const exist = await Coupon.findOne({ name: couponName });
        if (exist) {
            req.flash('exist', "this coupon name is alredy exist");
            res.redirect('/admin/addcoupon');
        } else {
            const newCoupon = new Coupon({
                name: couponName,
                couponCod: `${firstName}${randomString}${randomNumber}`,
                expiryDate: expiryDate,
                minSpend: limitOfUse,
                discount: Discount,
                type: type
            });
            await newCoupon.save()
            res.redirect('/admin/coupon')
        }

    } catch (error) {
        console.log(error);
    }
}


const deleteCoupon = async (req, res) => {
    try {
        const couponId = req.body.id;
        await Coupon.findOneAndUpdate({ _id: couponId }, {
            $set: {
                isDeleted: true
            }
        });
        res.json({ ok: true })
    } catch (error) {
        console.log(error);
    }
}

const loadEditcoupon = async (req, res) => {
    try {
        const id = req.query.id;
        const coupon = await Coupon.findOne({ _id: id });
        res.render('editCoupon', { coupon });
    } catch (error) {
        console.log(error);
    }
}

const updateCoupon = async (req, res) => {
    try {
        const { id, couponName, expiryDate, limitOfUse, Discount } = req.body;
        const exist = await Coupon.findOne({ _id: { $ne: id }, name: couponName });
        if (exist) {
            req.flash('exists', "coupon alredy exists with this name ");
            res.redirect(`/admin/editCoupon?id=${id}`);
        } else {
            await Coupon.updateOne({ _id: id }, {
                $set: {
                    name: couponName,
                    expiryDate: expiryDate,
                    minSpend: limitOfUse,
                    discount: Discount
                }
            })
            res.redirect('/admin/coupon')
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    loadCoupon,
    loadAddcoupon,
    addCoupon,
    deleteCoupon,
    loadEditcoupon,
    updateCoupon
}