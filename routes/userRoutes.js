const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { checkUserRole } = require('../controllers/userController.js');
const { userValidationRules, validate } = require('../validators');

// GET all users
router.get('/users', checkUserRole, userController.getAllUsers);

// GET a single user by ID
router.get('/users/:userId', checkUserRole, userController.getUserById);

// POST a new user
router.post('/users', userValidationRules(), validate, userController.createUser);

// PUT to update a user
router.put('/users/:userId', checkUserRole, userValidationRules(), validate, userController.updateUser);

// DELETE a user
router.delete('/users/:userId', checkUserRole, userController.deleteUser);

router.get('/google', userController.getAuthenticated);
router.get('/api/session/oauth/google', userController.sendAuthUrl);
router.get('/logout', userController.logoutUser);

module.exports = router;
