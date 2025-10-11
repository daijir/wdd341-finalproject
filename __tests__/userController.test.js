const userController = require('../controllers/userController');
const User = require('../models/user.js');
const googleClient = require('../oauth/googleClient.js');

jest.mock('../models/user.js');
jest.mock('../oauth/googleClient.js');

describe('User Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            query: {},
            session: {
                destroy: jest.fn((cb) => cb()),
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
            redirect: jest.fn(),
            clearCookie: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return all users with status 200', async () => {
            const mockUsers = [{ name: 'User 1' }];
            User.find.mockResolvedValue(mockUsers);

            await userController.getAllUsers(req, res);

            expect(User.find).toHaveBeenCalledWith();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should filter users by email if query is provided', async () => {
            req.query.email = 'test@test.com';
            await userController.getAllUsers(req, res);
            expect(User.find).toHaveBeenCalledWith({ email: 'test@test.com' });
        });

        it('should handle errors and return status 500', async () => {
            const error = new Error('DB Error');
            User.find.mockRejectedValue(error);
            await userController.getAllUsers(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('getUserById', () => {
        it('should return a single user if found', async () => {
            const mockUser = { _id: '1', name: 'Test User' };
            req.params.userId = '1';
            User.findById.mockResolvedValue(mockUser);

            await userController.getUserById(req, res);

            expect(User.findById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 404 if user not found', async () => {
            req.params.userId = '999';
            User.findById.mockResolvedValue(null);

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });

    describe('createUser', () => {
        it('should create a new user and return it with status 201', async () => {
            const userData = { name: 'New', email: 'new@test.com' };
            const savedUser = { _id: 'newId', ...userData };
            req.body = userData;

            const mockSave = jest.fn().mockResolvedValue(savedUser);
            User.mockImplementation(() => ({ save: mockSave }));

            await userController.createUser(req, res);

            expect(mockSave).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(savedUser);
        });
    });

    describe('updateUser', () => {
        it('should update a user and return it with status 200', async () => {
            const updateData = { name: 'Updated' };
            const updatedUser = { _id: '1', ...updateData };
            req.params.userId = '1';
            req.body = updateData;
            User.findByIdAndUpdate.mockResolvedValue(updatedUser);

            await userController.updateUser(req, res);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith('1', updateData, { new: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        it('should return 404 if user to update is not found', async () => {
            req.params.userId = '999';
            User.findByIdAndUpdate.mockResolvedValue(null);
            await userController.updateUser(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });

    describe('deleteUser', () => {
        it('should delete a user and return a success message', async () => {
            req.params.userId = '1';
            User.findByIdAndDelete.mockResolvedValue({ _id: '1' });

            await userController.deleteUser(req, res);

            expect(User.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
        });
    });

    describe('Authentication', () => {
        it('getAuthenticated should call googleClient.getAuthenticatedClient', async () => {
            await userController.getAuthenticated(req, res, next);
            expect(googleClient.getAuthenticatedClient).toHaveBeenCalledWith(req, res);
            expect(next).toHaveBeenCalled();
        });

        it('sendAuthUrl should call googleClient.googleCallback', async () => {
            await userController.sendAuthUrl(req, res, next);
            expect(googleClient.googleCallback).toHaveBeenCalledWith(req, res);
            expect(next).toHaveBeenCalled();
        });

        it('logoutUser should destroy session and clear cookie', async () => {
            await userController.logoutUser(req, res);
            expect(req.session.destroy).toHaveBeenCalled();
            expect(res.clearCookie).toHaveBeenCalledWith('session');
            expect(res.redirect).toHaveBeenCalledWith('/');
        });
    });

    describe('Middlewares', () => {
        describe('checkSession', () => {
            it('should call next if user is authenticated', async () => {
                req.session.isAuthenticated = true;
                await userController.checkSession(req, res, next);
                expect(next).toHaveBeenCalled();
                expect(res.status).not.toHaveBeenCalled();
            });

            it('should return 401 if user is not authenticated', async () => {
                req.session.isAuthenticated = false;
                await userController.checkSession(req, res, next);
                expect(next).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required, please log in using /google' });
            });
        });

        describe('checkUserRole', () => {
            it('should call next if user is admin', async () => {
                req.session.user = { email: 'admin@test.com' };
                User.findOne.mockResolvedValue({ role: 'user' });
                await userController.checkUserRole(req, res, next);
                expect(User.findOne).toHaveBeenCalledWith({ email: 'admin@test.com' });
                expect(next).toHaveBeenCalled();
            });

            it('should return 500 if session is missing', async () => {
                req.session = undefined;
                await userController.checkUserRole(req, res, next);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ message: 'A session is required, please log in using /google' });
            });
        });
    });
});