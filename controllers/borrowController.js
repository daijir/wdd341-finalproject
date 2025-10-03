const Borrow = require('../models/borrow.js');

// GET all borrow records, with optional filtering
exports.getAllBorrows = async (req, res) => {
  try {
    let query = {};
    if (req.query.userId) {
      query.userId = req.query.userId;
    }
    if (req.query.bookId) {
      query.bookId = req.query.bookId;
    }
    const borrows = await Borrow.find(query);
    res.json(borrows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST a new borrow record


// PUT to update a borrow record (e.g., return a book)
exports.updateBorrow = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.borrowId);
    if (borrow == null) {
      return res.status(404).json({ message: 'Cannot find borrow record' });
    }
    const updateData = {
      bookId: req.body.bookId,
      userId: req.body.userId,
      borrowedAt: req.body.borrowedAt,
      returnedAt: req.body.returnedAt,
      status: req.body.status
    };
    await Borrow.updateOne({ _id: req.params.borrowId }, { $set: updateData });
    res.json({ message: 'Updated Borrow Record' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE a borrow record
exports.deleteBorrow = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.borrowId);
    if (borrow == null) {
      return res.status(404).json({ message: 'Cannot find borrow record' });
    }

    // Add authorization check here (e.g., only admin can delete)

    await borrow.deleteOne();
    res.json({ message: 'Deleted Borrow Record' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
