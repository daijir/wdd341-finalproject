const reviewController = require('../controllers/reviewController');
const Review = require('../models/review.js');

jest.mock('../models/review.js');

describe('Review Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { params: {}, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('getReviewsForBook', () => {
        it('should return all reviews for a book with status 200', async () => {
            const mockReviews = [{ rating: 5, comment: 'Excellent' }];
            req.params.bookId = 'book1';
            Review.find.mockResolvedValue(mockReviews);

            await reviewController.getReviewsForBook(req, res);

            expect(Review.find).toHaveBeenCalledWith({ bookId: 'book1' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockReviews);
        });

        it('should handle errors and return status 500', async () => {
            const error = new Error('DB Error');
            Review.find.mockRejectedValue(error);

            await reviewController.getReviewsForBook(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('createReview', () => {
        it('should create a new review and return it with status 201', async () => {
            const reviewData = { userId: 'user1', rating: 5, comment: 'Loved it' };
            const savedReview = { _id: 'review1', ...reviewData };
            req.params.bookId = 'book1';
            req.body = reviewData;

            const mockSave = jest.fn().mockResolvedValue(savedReview);
            Review.mockImplementation(() => ({ save: mockSave }));

            await reviewController.createReview(req, res);

            expect(mockSave).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(savedReview);
        });

        it('should handle save errors and return status 400', async () => {
            const error = new Error('Validation failed');
            req.body = { rating: 5 };
            const mockSave = jest.fn().mockRejectedValue(error);
            Review.mockImplementation(() => ({ save: mockSave }));

            await reviewController.createReview(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('updateReview', () => {
        it('should update a review and return it with status 200', async () => {
            const reviewId = 'review1';
            const updateData = { rating: 4, comment: 'Pretty good' };
            const updatedReview = { _id: reviewId, ...updateData };
            req.params.reviewId = reviewId;
            req.body = updateData;

            Review.findByIdAndUpdate.mockResolvedValue(updatedReview);

            await reviewController.updateReview(req, res);

            expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(reviewId, updateData, { new: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedReview);
        });

        it('should return status 404 if review to update is not found', async () => {
            req.params.reviewId = '999';
            Review.findByIdAndUpdate.mockResolvedValue(null);

            await reviewController.updateReview(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Review not found' });
        });
    });

    describe('deleteReview', () => {
        it('should delete a review and return a success message with status 200', async () => {
            const reviewId = 'review1';
            req.params.reviewId = reviewId;
            Review.findByIdAndDelete.mockResolvedValue({ _id: reviewId });

            await reviewController.deleteReview(req, res);

            expect(Review.findByIdAndDelete).toHaveBeenCalledWith(reviewId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Review deleted successfully' });
        });

        it('should return status 404 if review to delete is not found', async () => {
            req.params.reviewId = '999';
            Review.findByIdAndDelete.mockResolvedValue(null);

            await reviewController.deleteReview(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Review not found' });
        });
    });
});