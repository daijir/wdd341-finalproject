const Review = require('../models/review.js');

// GET all reviews for a specific book
exports.getReviewsForBook = async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId });
    res.json(reviews);
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
    const review = await Review.findById(req.params.reviewId);
    if (review == null) {
      return res.status(404).json({ message: 'Cannot find review' });
    }
    const updateData = {
      bookId: req.body.bookId,
      userId: req.body.userId,
      rating: req.body.rating,
      comment: req.body.comment,
      createdAt: req.body.createdAt
    };
    await Review.updateOne({ _id: req.params.reviewId }, { $set: updateData });
    res.json({ message: 'Updated Review' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE a review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (review == null) {
      return res.status(404).json({ message: 'Cannot find review' });
    }

    // Add authorization check here

    await review.deleteOne();
    res.json({ message: 'Deleted Review' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
