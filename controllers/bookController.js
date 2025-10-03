const req = require('express/lib/request.js');
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


exports.createBook = async (req, res) => {
  // Placeholder for authentication check (e.g., only admin can add books)
  // if (!req.user.isAdmin) {
  //   return res.status(403).json({ message: 'Forbidden' });
  // }
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    yearPublished: req.body.yearPublished,
    copiesAvailable: req.body.copiesAvailable,
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (book == null) {
      return res.status(404).json({ message: 'Cannot find book' })
    }
    const updateData = {
      author: req.body.author,
      title: req.body.title,
      isbn: req.body.isbn,
      stock: req.body.stock
    }
    await Book.updateOne({ _id: req.params.bookId }, { $set: updateData })
    res.json({ message: 'Updated Book' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

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