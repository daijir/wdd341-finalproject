const express = require('express');
const { checkUserRole, checkSession } = require('../controllers/userController.js');
const router = express.Router();
const bookController = require('../controllers/bookController.js');
const { bookValidationRules, validate } = require('../validators');

// GET all books
router.get('/books', checkSession, bookController.getAllBooks);

// POST a new book
router.post('/books', bookValidationRules(), validate, bookController.createBook);

// GET a single book by ID
router.get('/books/:bookId', checkSession, bookController.getBookById);

// Update a single book by ID
router.put('/books/:bookId', checkUserRole, bookValidationRules(), validate, bookController.updateBook);

// DELETE a book
router.delete('/books/:bookId', checkUserRole, bookController.deleteBook);

module.exports = router;