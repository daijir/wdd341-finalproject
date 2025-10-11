const request = require('supertest');
const express = require('express');
const bookRoutes = require('../routes/bookRoutes');

// Mock controllers to isolate route tests
const bookController = require('../controllers/bookController');
const userController = require('../controllers/userController');

jest.mock('../controllers/bookController');
jest.mock('../controllers/userController', () => ({
    checkUserRole: jest.fn((req, res, next) => next()),
    checkSession: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/', bookRoutes);

describe('Book Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should call checkSession and getAllBooks, and return a list of books', async () => {
            const mockBooks = [{ id: '1', title: 'Test Book' }];
            bookController.getAllBooks.mockImplementation((req, res) => {
                res.status(200).json(mockBooks);
            });

            const response = await request(app).get('/');

            expect(userController.checkSession).toHaveBeenCalledTimes(1);
            expect(bookController.getAllBooks).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBooks);
        });
    });

    describe('POST /', () => {
        it('should call createBook and return the new book', async () => {
            const newBook = { title: 'New Book', author: 'Author' };
            const createdBook = { id: '2', ...newBook };
            bookController.createBook.mockImplementation((req, res) => {
                res.status(201).json(createdBook);
            });

            const response = await request(app)
                .post('/')
                .send(newBook);

            expect(bookController.createBook).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(createdBook);
        });
    });

    describe('GET /:bookId', () => {
        it('should call checkSession and getBookById, and return a single book', async () => {
            const mockBook = { id: '1', title: 'Single Book' };
            bookController.getBookById.mockImplementation((req, res) => {
                res.status(200).json(mockBook);
            });

            const response = await request(app).get('/1');

            expect(userController.checkSession).toHaveBeenCalledTimes(1);
            expect(bookController.getBookById).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBook);
        });

        it('should return 404 if book is not found', async () => {
            bookController.getBookById.mockImplementation((req, res) => {
                res.status(404).json({ message: 'Book not found' });
            });

            const response = await request(app).get('/999');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Book not found' });
        });
    });

    describe('PUT /:bookId', () => {
        it('should call checkUserRole and updateBook, and return the updated book', async () => {
            const updatedData = { title: 'Updated Title' };
            const updatedBook = { id: '1', title: 'Updated Title' };
            bookController.updateBook.mockImplementation((req, res) => {
                res.status(200).json(updatedBook);
            });

            const response = await request(app)
                .put('/1')
                .send(updatedData);

            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(bookController.updateBook).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedBook);
        });
    });

    describe('DELETE /:bookId', () => {
        it('should call checkUserRole and deleteBook, and return a success message', async () => {
            bookController.deleteBook.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Book deleted successfully' });
            });

            const response = await request(app).delete('/1');

            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(bookController.deleteBook).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Book deleted successfully' });
        });
    });
});