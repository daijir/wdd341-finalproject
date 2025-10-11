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

const app = express();
app.use(express.json());
app.use('/', reviewRoutes);

describe('Review Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
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
        it('should call checkSession and createReview, and return the new review', async () => {
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
    });

    describe('PUT /reviews/:reviewId', () => {
        it('should call checkSession and updateReview, and return the updated review', async () => {
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