const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController.js');

// GET all reviews for a book
router.get('/books/:bookId/reviews', reviewController.getReviewsForBook);

// POST a new review for a book
router.post('/books/:bookId/reviews', reviewController.createReview);

// PUT to update a review
router.put('/reviews/:reviewId', reviewController.updateReview);

// DELETE a review
router.delete('/reviews/:reviewId', reviewController.deleteReview);

module.exports = router;
