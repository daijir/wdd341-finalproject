const express = require('express');
const { checkUserRole, checkSession } = require('../controllers/userController.js');
const router = express.Router();
const bookController = require('../controllers/bookController.js');

// GET all books
router.get('/', checkSession, bookController.getAllBooks);

// POST a new book
router.post('/', bookController.createBook);

// GET a single book by ID
router.get('/:bookId', checkSession, bookController.getBookById);

// Update a single book by ID
router.put('/:bookId', checkUserRole, bookController.updateBook);

// DELETE a book
router.delete('/:bookId', checkUserRole, bookController.deleteBook);

module.exports = router;