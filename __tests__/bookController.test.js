const bookController = require('../controllers/bookController');
const Book = require('../models/book.js');

// Mock the Mongoose model
jest.mock('../models/book.js');

describe('Book Controller', () => {
    let req, res, next;

    // Reset mocks before each test
    beforeEach(() => {
        req = {
            params: {},
            body: {},
            query: {}, // Added to prevent TypeError in getAllBooks
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('getAllBooks', () => {
        it('should return all books with status 200', async () => {
            const mockBooks = [{ title: 'Book 1' }, { title: 'Book 2' }];
            Book.find.mockResolvedValue(mockBooks);

            await bookController.getAllBooks(req, res);

            expect(Book.find).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBooks);
        });

        it('should handle errors and return status 500', async () => {
            const error = new Error('Database error');
            Book.find.mockRejectedValue(error);

            await bookController.getAllBooks(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('getBookById', () => {
        it('should return a single book with status 200 if found', async () => {
            const mockBook = { _id: '1', title: 'Test Book' };
            req.params.bookId = '1';
            Book.findById.mockResolvedValue(mockBook);

            await bookController.getBookById(req, res);

            expect(Book.findById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBook);
        });

        it('should return status 404 if book is not found', async () => {
            req.params.bookId = '999';
            Book.findById.mockResolvedValue(null);

            await bookController.getBookById(req, res);

            expect(Book.findById).toHaveBeenCalledWith('999');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
        });

        it('should handle errors and return status 500', async () => {
            const error = new Error('Database error');
            req.params.bookId = '1';
            Book.findById.mockRejectedValue(error);

            await bookController.getBookById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('createBook', () => {
        it('should create a new book and return it with status 201', async () => {
            const newBookData = { title: 'New Book', author: 'Author' };
            const savedBook = { _id: 'newId', ...newBookData };
            req.body = newBookData;

            // Mock the constructor and the save method
            const mockSave = jest.fn().mockResolvedValue(savedBook);
            Book.mockImplementation(() => ({
                save: mockSave,
            }));

            await bookController.createBook(req, res);

            expect(mockSave).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(savedBook);
        });

        it('should handle errors and return status 400', async () => {
            const error = new Error('Creation failed');
            req.body = { title: 'New Book' };

            const mockSave = jest.fn().mockRejectedValue(error);
            Book.mockImplementation(() => ({
                save: mockSave,
            }));

            await bookController.createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('updateBook', () => {
        it('should update a book and return it with status 200', async () => {
            const bookId = '1';
            const updateData = { title: 'Updated Title' };
            const updatedBook = { _id: bookId, ...updateData };
            req.params.bookId = bookId;
            req.body = updateData;

            Book.findByIdAndUpdate.mockResolvedValue(updatedBook);

            await bookController.updateBook(req, res);

            expect(Book.findByIdAndUpdate).toHaveBeenCalledWith(bookId, updateData, { new: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedBook);
        });

        it('should return status 404 if book to update is not found', async () => {
            req.params.bookId = '999';
            Book.findByIdAndUpdate.mockResolvedValue(null);

            await bookController.updateBook(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
        });
    });

    describe('deleteBook', () => {
        it('should delete a book and return status 200', async () => {
            const bookId = '1';
            req.params.bookId = bookId;
            const deletedBook = { _id: bookId, title: 'Deleted Book' };

            Book.findByIdAndDelete.mockResolvedValue(deletedBook);

            await bookController.deleteBook(req, res);

            expect(Book.findByIdAndDelete).toHaveBeenCalledWith(bookId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book deleted successfully' });
        });

        it('should return status 404 if book to delete is not found', async () => {
            req.params.bookId = '999';
            Book.findByIdAndDelete.mockResolvedValue(null);

            await bookController.deleteBook(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
        });
    });
});