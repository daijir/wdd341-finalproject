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
    res.status(200).json(borrows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST a new borrow record
exports.createBorrow = async (req, res) => {
  const { bookId, userId } = req.body;

  if (!bookId || !userId) {
    return res.status(400).json({ message: 'Book ID and User ID are required.' });
  }

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
exports.updateBorrow = async (req, res) => {
  try {
    const updateData = {
      status: req.body.status
    };
    const updatedBorrow = await Borrow.findByIdAndUpdate(req.params.borrowId, updateData, { new: true });

    if (updatedBorrow == null) {
      return res.status(404).json({ message: 'Cannot find borrow record' });
    }
    res.status(200).json(updatedBorrow);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// DELETE a borrow record
exports.deleteBorrow = async (req, res) => {
  try {
    const deletedBorrow = await Borrow.findByIdAndDelete(req.params.borrowId);
    if (deletedBorrow == null) {
      return res.status(404).json({ message: 'Cannot find borrow record' });
    }

    res.status(200).json({ message: 'Deleted Borrow Record' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
