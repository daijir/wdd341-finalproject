const borrowController = require('../controllers/borrowController');
const Borrow = require('../models/borrow.js');

// Mock the Mongoose model
jest.mock('../models/borrow.js');

describe('Borrow Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            query: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('getAllBorrows', () => {
        it('should return all borrow records with status 200', async () => {
            const mockBorrows = [{ userId: 'user1', bookId: 'book1' }];
            Borrow.find.mockResolvedValue(mockBorrows);

            await borrowController.getAllBorrows(req, res);

            expect(Borrow.find).toHaveBeenCalledWith({});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBorrows);
        });

        it('should handle errors and return status 500', async () => {
            const error = new Error('Database error');
            Borrow.find.mockRejectedValue(error);

            await borrowController.getAllBorrows(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('createBorrow', () => {
        it('should create a new borrow record and return it with status 201', async () => {
            const borrowData = { userId: 'user1', bookId: 'book1' };
            const savedBorrow = { _id: 'newId', ...borrowData };
            req.body = borrowData;

            const mockSave = jest.fn().mockResolvedValue(savedBorrow);
            Borrow.mockImplementation(() => ({
                save: mockSave,
            }));

            await borrowController.createBorrow(req, res);

            expect(mockSave).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(savedBorrow);
        });

        it('should return status 400 if required fields are missing', async () => {
            req.body = { userId: 'user1' }; // bookId is missing

            await borrowController.createBorrow(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book ID and User ID are required.' });
        });
    });

    describe('updateBorrow', () => {
        it('should update a borrow record and return it with status 200', async () => {
            const borrowId = '1';
            const updateData = { status: 'returned' };
            req.params.borrowId = borrowId;
            req.body = updateData;

            Borrow.findByIdAndUpdate.mockResolvedValue({ _id: borrowId, ...updateData });

            await borrowController.updateBorrow(req, res);

            expect(Borrow.findByIdAndUpdate).toHaveBeenCalledWith(borrowId, { status: 'returned' }, { new: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining(updateData));
        });

        it('should return status 404 if borrow record is not found', async () => {
            req.params.borrowId = '999';
            Borrow.findByIdAndUpdate.mockResolvedValue(null);

            await borrowController.updateBorrow(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Cannot find borrow record' });
        });
    });

    describe('deleteBorrow', () => {
        it('should delete a borrow record and return a success message', async () => {
            const borrowId = '1';
            req.params.borrowId = borrowId;
            Borrow.findByIdAndDelete.mockResolvedValue({ _id: borrowId });

            await borrowController.deleteBorrow(req, res);

            expect(Borrow.findByIdAndDelete).toHaveBeenCalledWith(borrowId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Deleted Borrow Record' });
        });

        it('should return 404 if borrow record to delete is not found', async () => {
            req.params.borrowId = '999';
            Borrow.findByIdAndDelete.mockResolvedValue(null);

            await borrowController.deleteBorrow(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Cannot find borrow record' });
        });
    });
});
