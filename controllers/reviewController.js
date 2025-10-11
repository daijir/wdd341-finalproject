const Review = require('../models/review.js');

// GET all reviews for a specific book
exports.getReviewsForBook = async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST a new review for a specific book
exports.createReview = async (req, res) => {
  const review = new Review({
    bookId: req.params.bookId, // from URL
    userId: req.body.userId, // from request body (or authenticated user)
    rating: req.body.rating,
    comment: req.body.comment,
    reviewDate: new Date(),
  });
  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT to update a review
exports.updateReview = async (req, res) => {
  try {
    const updateData = {
      rating: req.body.rating,
      comment: req.body.comment,
    };
    // Use findByIdAndUpdate for an atomic operation that returns the updated document
    const updatedReview = await Review.findByIdAndUpdate(req.params.reviewId, updateData, { new: true });

    if (updatedReview == null) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(updatedReview);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// DELETE a review
exports.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.reviewId);
    if (deletedReview == null) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
