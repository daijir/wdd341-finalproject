const Book = require('../models/book.js');

exports.getAllBooks = async (req, res) => {
  try {
    let books;
    if (req.query && req.query.author) {
      books = await Book.find({ author: req.query.author });
    } else {
      books = await Book.find();
    }
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (book == null) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
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
    const updateData = {
      author: req.body.author,
      title: req.body.title,
      isbn: req.body.isbn,
      stock: req.body.stock
    };
    const updatedBook = await Book.findByIdAndUpdate(req.params.bookId, updateData, { new: true });

    if (updatedBook == null) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(updatedBook);
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
    const deletedBook = await Book.findByIdAndDelete(req.params.bookId);
    if (deletedBook == null) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};