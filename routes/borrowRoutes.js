const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController.js');

// GET all borrow records
router.get('/borrows', borrowController.getAllBorrows);

// POST a new borrow record
router.post('/borrows', borrowController.createBorrow);

// PUT to update a borrow record
router.put('/borrows/:borrowId', borrowController.updateBorrow);

// DELETE a borrow record
router.delete('/borrows/:borrowId', borrowController.deleteBorrow);

module.exports = router;
