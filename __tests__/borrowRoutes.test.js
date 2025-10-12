const request = require('supertest');
const express = require('express');
const borrowRoutes = require('../routes/borrowRoutes');

// Mock controllers to isolate route tests
const borrowController = require('../controllers/borrowController');
const userController = require('../controllers/userController');

jest.mock('../controllers/borrowController');
jest.mock('../controllers/userController', () => ({
    // Assuming borrow routes are also session protected
    checkSession: jest.fn((req, res, next) => next()),
    // Assuming some routes might have role checks (e.g., admin)
    checkUserRole: jest.fn((req, res, next) => next()),
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
// Mounting routes on the /borrows prefix, as defined in server.js
app.use('/', borrowRoutes);

describe('Borrow Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
        require('express-validator').validationResult.mockImplementation(() => ({ isEmpty: () => true, array: () => [] }));
    });

    describe('GET /borrows', () => {
        it('should call checkSession and getAllBorrows, and return a list of borrow records', async () => {
            const mockBorrows = [{ _id: '1', userId: 'user1', bookId: 'book1' }];
            borrowController.getAllBorrows.mockImplementation((req, res) => {
                res.status(200).json(mockBorrows);
            });

            const response = await request(app).get('/borrows');

            expect(userController.checkSession).toHaveBeenCalledTimes(1);
            expect(borrowController.getAllBorrows).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBorrows);
        });
    });

    describe('POST /borrows', () => {
        it('should call checkSession and createBorrow, and return the new borrow record with valid data', async () => {
            const newBorrowData = { userId: 'user1', bookId: 'book1' };
            const createdBorrow = { _id: 'newId', ...newBorrowData, borrowDate: new Date().toISOString() };
            borrowController.createBorrow.mockImplementation((req, res) => {
                res.status(201).json(createdBorrow);
            });

            const response = await request(app)
                .post('/borrows')
                .send(newBorrowData);

            expect(userController.checkSession).toHaveBeenCalledTimes(1);
            expect(borrowController.createBorrow).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(createdBorrow);
        });

        it('should return 422 if validation fails', async () => {
            const newBorrowData = { userId: '', bookId: 'book1' }; // Invalid userId
            const mockErrors = {
                isEmpty: () => false,
                array: () => [{ param: 'userId', msg: 'User is required.' }],
            };
            require('express-validator').validationResult.mockImplementation(() => mockErrors);

            const response = await request(app)
                .post('/borrows')
                .send(newBorrowData);

            expect(userController.checkSession).toHaveBeenCalledTimes(1);
            expect(require('express-validator').validationResult).toHaveBeenCalledTimes(1);
            expect(borrowController.createBorrow).not.toHaveBeenCalled();
            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                errors: [
                    { userId: 'User is required.' }
                ]
            });
        });
    });

    describe('PUT /borrows/:borrowId', () => {
        it('should call checkUserRole and updateBorrow, and return a success message with valid data', async () => {
            const updateData = { status: 'returned' };
            borrowController.updateBorrow.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Updated Borrow Record' });
            });

            const response = await request(app)
                .put('/borrows/1')
                .send(updateData);

            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(borrowController.updateBorrow).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Updated Borrow Record' });
        });

        it('should return 422 if validation fails on update', async () => {
            const updateData = { userId: '' }; // Assuming userId is required for update as well
            const mockErrors = {
                isEmpty: () => false,
                array: () => [{ param: 'userId', msg: 'User is required.' }],
            };
            require('express-validator').validationResult.mockImplementation(() => mockErrors);

            const response = await request(app)
                .put('/borrows/1')
                .send(updateData);

            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(require('express-validator').validationResult).toHaveBeenCalledTimes(1);
            expect(borrowController.updateBorrow).not.toHaveBeenCalled();
            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                errors: [
                    { userId: 'User is required.' }
                ]
            });
        });
    });

    describe('DELETE /borrows/:borrowId', () => {
        it('should call checkUserRole and deleteBorrow, and return a success message', async () => {
            borrowController.deleteBorrow.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Deleted Borrow Record' });
            });

            const response = await request(app).delete('/borrows/1');

            // Assuming delete is an admin operation, calling checkUserRole
            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(borrowController.deleteBorrow).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Deleted Borrow Record' });
        });
    });
});
