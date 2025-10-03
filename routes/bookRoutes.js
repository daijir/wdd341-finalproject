const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController.js');

// GET all books
router.get('/books', bookController.getAllBooks);

// GET a single book by ID
router.get('/books/:bookId', bookController.getBookById);

// Update a single book by ID
router.put('books/:bookId', bookController.updateBook);

// DELETE a book
router.delete('/books/:bookId', bookController.deleteBook);

module.exports = router;