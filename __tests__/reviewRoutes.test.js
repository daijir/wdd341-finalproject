const request = require('supertest');
const express = require('express');
const reviewRoutes = require('../routes/reviewRoutes');

// Mock controllers to isolate route tests
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');

jest.mock('../controllers/reviewController');
jest.mock('../controllers/userController', () => ({
    checkSession: jest.fn((req, res, next) => next()),
}));

// Mock express-validator
jest.mock('express-validator', () => ({
    ...jest.requireActual('express-validator'),
    validationResult: jest.fn(() => ({
        isEmpty: () => true,
        array: () => [],
    })),
}));

const app = express();
app.use(express.json());
app.use('/', reviewRoutes);

describe('Review Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
        require('express-validator').validationResult.mockImplementation(() => ({ isEmpty: () => true, array: () => [] }));
    });

    describe('GET /books/:bookId/reviews', () => {
        it('should call checkSession and getReviewsForBook, and return reviews', async () => {
            const mockReviews = [{ _id: '1', rating: 5, comment: 'Great book!' }];
            reviewController.getReviewsForBook.mockImplementation((req, res) => {
                res.status(200).json(mockReviews);
            });

            const response = await request(app).get('/books/book123/reviews');

            expect(userController.checkSession).toHaveBeenCalledTimes(1);
            expect(reviewController.getReviewsForBook).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockReviews);
        });
    });

    describe('POST /books/:bookId/reviews', () => {
        it('should call checkSession and createReview, and return the new review with valid data', async () => {
            const newReviewData = { rating: 4, comment: 'Good read.' };
            const createdReview = { _id: 'newId', ...newReviewData };
            reviewController.createReview.mockImplementation((req, res) => {
                res.status(201).json(createdReview);
            });

            const response = await request(app)
                .post('/books/book123/reviews')
                .send(newReviewData);

            expect(userController.checkSession).toHaveBeenCalledTimes(1);
            expect(reviewController.createReview).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(createdReview);
        });

        it('should return 422 if validation fails', async () => {
            const newReviewData = { rating: 6, comment: 'Invalid rating.' }; // Invalid rating
            const mockErrors = {
                isEmpty: () => false,
                array: () => [{ param: 'rating', msg: 'Rating must be an integer between 1 and 5.' }],
            };
            require('express-validator').validationResult.mockImplementation(() => mockErrors);

            const response = await request(app)
                .post('/books/book123/reviews')
                .send(newReviewData);

            expect(userController.checkSession).toHaveBeenCalledTimes(1);
            expect(require('express-validator').validationResult).toHaveBeenCalledTimes(1);
            expect(reviewController.createReview).not.toHaveBeenCalled();
            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                errors: [
                    { rating: 'Rating must be an integer between 1 and 5.' }
                ]
            });
        });
    });

    describe('PUT /reviews/:reviewId', () => {
        it('should call checkSession and updateReview, and return the updated review with valid data', async () => {
            const updateData = { rating: 5 };
            const updatedReview = { _id: 'review1', rating: 5, comment: 'Good read.' };
            reviewController.updateReview.mockImplementation((req, res) => {
                res.status(200).json(updatedReview);
            });

            const response = await request(app)
                .put('/reviews/review1')
                .send(updateData);

            expect(userController.checkSession).toHaveBeenCalledTimes(1);
            expect(reviewController.updateReview).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedReview);
        });

        it('should return 422 if validation fails on update', async () => {
            const updateData = { comment: '' }; // Invalid comment
            const mockErrors = {
                isEmpty: () => false,
                array: () => [{ param: 'comment', msg: 'Comment is required.' }],
            };
            require('express-validator').validationResult.mockImplementation(() => mockErrors);

            const response = await request(app)
                .put('/reviews/review1')
                .send(updateData);

            expect(userController.checkSession).toHaveBeenCalledTimes(1);
            expect(require('express-validator').validationResult).toHaveBeenCalledTimes(1);
            expect(reviewController.updateReview).not.toHaveBeenCalled();
            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                errors: [
                    { comment: 'Comment is required.' }
                ]
            });
        });
    });

    describe('DELETE /reviews/:reviewId', () => {
        it('should call checkSession and deleteReview, and return a success message', async () => {
            reviewController.deleteReview.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Review deleted successfully' });
            });

            const response = await request(app).delete('/reviews/review1');

            expect(userController.checkSession).toHaveBeenCalledTimes(1);
            expect(reviewController.deleteReview).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Review deleted successfully' });
        });
    });
});