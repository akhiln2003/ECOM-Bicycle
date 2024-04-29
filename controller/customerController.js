
const User = require('../models/userModel');

//customers listing
const loadCustomers = async (req, res) => {
  try {
    let page = 1;
    if (req.query.page) {
      page = req.query.page
    }
    let next = page + 1;
    let previous = page > 1 ? page - 1 : 1;
    let limit = 10;
    const count = await User.find().count();
    const totalPages = Math.ceil(count / limit);

    if (next > totalPages) {
      next = totalPages
    }

    const users = await User.find({}).sort({ dateJoined: -1 }).limit(limit).skip((page - 1) * limit).exec()
    res.render('customers', { users, totalPages, next, previous });

  } catch (error) {
    console.log(error);
  }
}

//Bblock and Unblock customers
const blockUser = async (req, res) => {
  try {
    const id = req.body.id;
    const user = await User.findOne({ _id: id });
    if (user.blocked) {
      await User.updateOne({ _id: id }, { $set: { blocked: false } });
    } else {
      await User.updateOne({ _id: id }, { $set: { blocked: true } });
    }
    res.json({ blocked: true });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  loadCustomers,
  blockUser,
}
