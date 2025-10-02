const Book = require('../models/book.js');

exports.getAllBooks = async (req, res) => {
  try {
    let books;
    if (req.query.author) {
      books = await Book.find({ author: req.query.author });
    } else {
      books = await Book.find();
    }
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (book == null) {
      return res.status(404).json({ message: 'Cannot find book' });
    }
    res.json(book);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  // Placeholder for authentication check
  // if (!req.user.isAdmin) {
  //   return res.status(403).json({ message: 'Forbidden' });
  // }
  try {
    const book = await Book.findById(req.params.bookId);
    if (book == null) {
      return res.status(404).json({ message: 'Cannot find book' });
    }

    await book.deleteOne();
    res.json({ message: 'Deleted Book' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};