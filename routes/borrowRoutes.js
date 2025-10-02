const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController.js');

// GET all borrow records
router.get('/borrows', borrowController.getAllBorrows);

// POST a new borrow record


// PUT to update a borrow record


// DELETE a borrow record
router.delete('/borrows/:borrowId', borrowController.deleteBorrow);

module.exports = router;
