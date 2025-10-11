const request = require('supertest');
const express = require('express');
const session = require('express-session');
const userRoutes = require('../routes/userRoutes');

// Mock the controller to isolate route tests
const userController = require('../controllers/userController');

jest.mock('../controllers/userController');

const app = express();

// Minimal session setup for tests
app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: true }));
app.use(express.json());
app.use('/', userRoutes);

describe('User Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /users', () => {
        it('should call checkUserRole and getAllUsers', async () => {
            userController.checkUserRole.mockImplementation((req, res, next) => next());
            userController.getAllUsers.mockImplementation((req, res) => res.status(200).send());
            await request(app).get('/users');
            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(userController.getAllUsers).toHaveBeenCalledTimes(1);
        });
    });

    describe('POST /users', () => {
        it('should call createUser', async () => {
            userController.createUser.mockImplementation((req, res) => res.status(201).send());
            await request(app).post('/users').send({ name: 'Test', email: 'test@test.com' });
            // The POST /users route does not use checkUserRole, so this check is removed.
            expect(userController.createUser).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /users/:userId', () => {
        it('should call checkUserRole and getUserById', async () => {
            userController.checkUserRole.mockImplementation((req, res, next) => next());
            userController.getUserById.mockImplementation((req, res) => res.status(200).send());
            await request(app).get('/users/123');
            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(userController.getUserById).toHaveBeenCalledTimes(1);
        });
    });

    describe('PUT /users/:userId', () => {
        it('should call checkUserRole and updateUser', async () => {
            userController.checkUserRole.mockImplementation((req, res, next) => next());
            userController.updateUser.mockImplementation((req, res) => res.status(200).send());
            await request(app).put('/users/123').send({ name: 'Updated' });
            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(userController.updateUser).toHaveBeenCalledTimes(1);
        });
    });

    describe('DELETE /users/:userId', () => {
        it('should call checkUserRole and deleteUser', async () => {
            userController.checkUserRole.mockImplementation((req, res, next) => next());
            userController.deleteUser.mockImplementation((req, res) => res.status(200).send());
            await request(app).delete('/users/123');
            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(userController.deleteUser).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /google', () => {
        it('should call getAuthenticated', async () => {
            userController.getAuthenticated.mockImplementation((req, res, next) => {
                res.status(200).send();
                next();
            });
            await request(app).get('/google');
            expect(userController.getAuthenticated).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /api/session/oauth/google', () => {
        it('should call sendAuthUrl', async () => {
            userController.sendAuthUrl.mockImplementation((req, res, next) => {
                res.status(200).send();
                next();
            });
            await request(app).get('/api/session/oauth/google');
            expect(userController.sendAuthUrl).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /logout', () => {
        it('should call logoutUser', async () => {
            userController.logoutUser.mockImplementation((req, res) => res.status(200).send());
            await request(app).get('/logout');
            expect(userController.logoutUser).toHaveBeenCalledTimes(1);
        });
    });
});