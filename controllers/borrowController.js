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
exports.createBorrow = async (req, res) => {
  const borrow = new Borrow({
    userId: req.body.userId,
    bookId: req.body.bookId,
    borrowDate: new Date(),
    // dueDate can be calculated, e.g., 2 weeks from now
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
  });
  try {
    const newBorrow = await borrow.save();
    res.status(201).json(newBorrow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// PUT to update a borrow record (e.g., return a book)


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
