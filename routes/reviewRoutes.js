const express = require('express');
const router = express.Router();
const { checkSession } = require('../controllers/userController.js');
const reviewController = require('../controllers/reviewController.js');
const { reviewValidationRules, validate } = require('../validators');

// GET all reviews for a book
router.get('/books/:bookId/reviews', checkSession, reviewController.getReviewsForBook);

// POST a new review for a book
router.post('/books/:bookId/reviews', checkSession, reviewValidationRules(), validate, reviewController.createReview);

// PUT to update a review
router.put('/reviews/:reviewId', checkSession, reviewValidationRules(), validate, reviewController.updateReview);

// DELETE a review
router.delete('/reviews/:reviewId', checkSession, reviewController.deleteReview);

module.exports = router;
