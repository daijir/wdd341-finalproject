const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { checkUserRole } = require('../controllers/userController.js');

// GET all users
router.get('/users', checkUserRole, userController.getAllUsers);

// GET a single user by ID
router.get('/users/:userId', checkUserRole, userController.getUserById);

// PUT to update a user
router.put('/users/:userId', checkUserRole, userController.updateUser);

// DELETE a user
router.delete('/users/:userId', checkUserRole, userController.deleteUser);

router.get('/google', userController.getAuthenticated);
router.get('/api/session/oauth/google', userController.sendAuthUrl);
router.get('/logout', userController.logoutUser);

module.exports = router;
