const express = require('express');
const { checkUserRole, checkSession } = require('../controllers/userController.js');
const router = express.Router();
const borrowController = require('../controllers/borrowController.js');

// GET all borrow records
router.get('/borrows', checkSession, borrowController.getAllBorrows);

// POST a new borrow record
router.post('/borrows', checkSession, borrowController.createBorrow);

// PUT to update a borrow record
router.put('/borrows/:borrowId', checkUserRole, borrowController.updateBorrow);

// DELETE a borrow record
router.delete('/borrows/:borrowId', checkUserRole, borrowController.deleteBorrow);

module.exports = router;
