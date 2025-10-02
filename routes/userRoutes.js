const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

// GET all users
router.get('/users', userController.getAllUsers);

// GET a single user by ID
router.get('/users/:userId', userController.getUserById);

// DELETE a user
router.delete('/users/:userId', userController.deleteUser);

module.exports = router;
