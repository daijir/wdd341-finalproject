const request = require('supertest');
const express = require('express');
const session = require('express-session');
const userRoutes = require('../routes/userRoutes');

// Mock the controller to isolate route tests
const userController = require('../controllers/userController');

jest.mock('../controllers/userController', () => ({
    checkUserRole: jest.fn((req, res, next) => next()),
    checkSession: jest.fn((req, res, next) => next()),
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getAuthenticated: jest.fn((req, res, next) => next()),
    sendAuthUrl: jest.fn((req, res, next) => next()),
    logoutUser: jest.fn(),
}));

const app = express();

// Minimal session setup for tests
app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: true }));
app.use(express.json());
app.use('/', userRoutes);

// Mock express-validator
jest.mock('express-validator', () => ({
    ...jest.requireActual('express-validator'),
    validationResult: jest.fn(() => ({
        isEmpty: () => true,
        array: () => [],
    })),
}));

describe('User Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
        require('express-validator').validationResult.mockImplementation(() => ({ isEmpty: () => true, array: () => [] }));
    });

    describe('GET /users', () => {
        it('should call checkUserRole and getAllUsers', async () => {
            userController.getAllUsers.mockImplementation((req, res) => res.status(200).send());
            await request(app).get('/users');
            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(userController.getAllUsers).toHaveBeenCalledTimes(1);
        });
    });

    describe('POST /users', () => {
        it('should call createUser with valid data', async () => {
            const validUserData = {
                googleId: '12345',
                email: 'test@test.com',
                username: 'testuser',
                password: 'password123',
                profile: {
                    firstName: 'Test',
                    lastName: 'User'
                }
            };
            userController.createUser.mockImplementation((req, res) => res.status(201).json(validUserData));

            const response = await request(app)
                .post('/users')
                .send(validUserData);

            expect(userController.createUser).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(201);
        });

        it('should return 422 if validation fails', async () => {
            const invalidUserData = { email: 'not-an-email' }; // Missing required fields
            const mockErrors = {
                isEmpty: () => false,
                array: () => [{ param: 'email', msg: 'A valid email is required.' }],
            };
            require('express-validator').validationResult.mockImplementation(() => mockErrors);

            const response = await request(app)
                .post('/users')
                .send(invalidUserData);

            expect(require('express-validator').validationResult).toHaveBeenCalledTimes(1);
            expect(userController.createUser).not.toHaveBeenCalled();
            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                errors: [
                    { email: 'A valid email is required.' }
                ]
            });
        });
    });

    describe('GET /users/:userId', () => {
        it('should call checkUserRole and getUserById', async () => {
            userController.getUserById.mockImplementation((req, res) => res.status(200).send());

            await request(app).get('/users/123');

            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(userController.getUserById).toHaveBeenCalledTimes(1);
        });
    });

    describe('PUT /users/:userId', () => {
        it('should call checkUserRole and updateUser', async () => {
            const validUpdateData = {
                googleId: '12345',
                email: 'test@test.com',
                username: 'testuser',
                password: 'password123',
                profile: {
                    firstName: 'Updated',
                    lastName: 'User'
                }
            };
            userController.updateUser.mockImplementation((req, res) => res.status(200).send());

            await request(app).put('/users/123').send(validUpdateData);

            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(userController.updateUser).toHaveBeenCalledTimes(1);
        });

        it('should return 422 if validation fails on update', async () => {
            const invalidUpdateData = { username: '' }; // Invalid username
            const mockErrors = {
                isEmpty: () => false,
                array: () => [{ param: 'username', msg: 'Username is required.' }],
            };
            require('express-validator').validationResult.mockImplementation(() => mockErrors);

            const response = await request(app)
                .put('/users/123')
                .send(invalidUpdateData);

            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(require('express-validator').validationResult).toHaveBeenCalledTimes(1);
            expect(userController.updateUser).not.toHaveBeenCalled();
            expect(response.status).toBe(422);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('DELETE /users/:userId', () => {
        it('should call checkUserRole and deleteUser', async () => {
            userController.deleteUser.mockImplementation((req, res) => res.status(200).send());

            await request(app).delete('/users/123');

            expect(userController.checkUserRole).toHaveBeenCalledTimes(1);
            expect(userController.deleteUser).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /google', () => {
        it('should call getAuthenticated', async () => {
            await request(app).get('/google');
            expect(userController.getAuthenticated).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /api/session/oauth/google', () => {
        it('should call sendAuthUrl', async () => {
            await request(app).get('/api/session/oauth/google');
            expect(userController.sendAuthUrl).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /logout', () => {
        it('should call logoutUser', async () => {
            userController.logoutUser.mockImplementation((req, res) => res.status(200).send('OK'));
            await request(app).get('/logout');
            expect(userController.logoutUser).toHaveBeenCalledTimes(1);
        });
    });
});