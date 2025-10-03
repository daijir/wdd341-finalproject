const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

// GET all users
router.get('/users', userController.getAllUsers);

// GET a single user by ID
router.get('/users/:userId', userController.getUserById);

// PUT to update a user
router.put('/users/:userId', userController.updateUser);

// DELETE a user
router.delete('/users/:userId', userController.deleteUser);

module.exports = router;
