const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
  return [
    body('googleId').notEmpty().withMessage('Google ID is required.'),
    body('email').isEmail().withMessage('A valid email is required.'),
    body('username').notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
    body('profile.firstName').notEmpty().withMessage('First name is required.'),
    body('profile.lastName').notEmpty().withMessage('Last name is required.'),
  ];
};

const bookValidationRules = () => {
  return [
    body('title').notEmpty().withMessage('Title is required.'),
    body('author').notEmpty().withMessage('Author is required.'),
    body('genre').notEmpty().withMessage('Genre is required.'),
    body('yearPublished').isInt().withMessage('Year published must be an integer.'),
    body('copiesAvailable').isInt({ min: 0 }).withMessage('Copies available must be a non-negative integer.'),
  ];
};

const reviewValidationRules = () => {
  return [
    body('user').notEmpty().withMessage('User is required.'),
    body('book').notEmpty().withMessage('Book is required.'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),
    body('comment').notEmpty().withMessage('Comment is required.'),
  ];
};

const borrowValidationRules = () => {
  return [
    body('user').notEmpty().withMessage('User is required.'),
    body('book').notEmpty().withMessage('Book is required.'),
    body('borrowDate').isISO8601().toDate().withMessage('Borrow date must be a valid date.'),
    body('returnDate').optional().isISO8601().toDate().withMessage('Return date must be a valid date.'),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userValidationRules,
  bookValidationRules,
  reviewValidationRules,
  borrowValidationRules,
  validate,
};
