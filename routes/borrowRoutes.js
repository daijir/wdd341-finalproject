const express = require('express');
const { checkUserRole, checkSession } = require('../controllers/userController.js');
const router = express.Router();
const borrowController = require('../controllers/borrowController.js');
const { borrowValidationRules, validate } = require('../validators');

// GET all borrow records
router.get('/borrows', checkSession, borrowController.getAllBorrows);

// POST a new borrow record
router.post('/borrows', checkSession, borrowValidationRules(), validate, borrowController.createBorrow);

// PUT to update a borrow record
router.put('/borrows/:borrowId', checkUserRole, borrowValidationRules(), validate, borrowController.updateBorrow);

// DELETE a borrow record
router.delete('/borrows/:borrowId', checkUserRole, borrowController.deleteBorrow);

module.exports = router;
