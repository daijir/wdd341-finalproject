const User = require('../models/user.js');

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    let users;
    if (req.query.email) {
      users = await User.find({ email: req.query.email });
    } else {
      users = await User.find();
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT to update a user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    const updateData = {
      name: req.body.name,
      email: req.body.email
    };
    await User.updateOne({ _id: req.params.userId }, { $set: updateData });
    res.json({ message: 'Updated User' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    await user.deleteOne();
    res.json({ message: 'Deleted User' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
