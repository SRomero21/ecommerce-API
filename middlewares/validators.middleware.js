const { body, validationResult } = require('express-validator');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.createUserValidators = [
  body('username')
    .isString()
    .withMessage('User name must be a string')
    .notEmpty()
    .withMessage('Must provide a valid user name'),
  body('email')
    .isString()
    .withMessage('Email must be a string')
    .notEmpty()
    .withMessage('Must provide a valid email'),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage('Password must have at least 8 characters')
];

exports.createProductValidator = [
  body('title')
    .isString()
    .withMessage('Product title must be a string')
    .notEmpty()
    .withMessage('Must provide a valid title'),
  body('description')
    .isString()
    .withMessage('Product description must be a string')
    .notEmpty()
    .withMessage('Must provide a valid description'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a integer')
    .custom((value) => value > 0)
    .withMessage('Price must be greater than 0'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantity must be a interger')
    .custom((value) => value > 0)
    .withMessage('Quantity must be greater than 0')
];

exports.addProductToCartValidation = [
  body('productId')
    .isNumeric()
    .withMessage('Product ID must be a number')
    .custom((value) => value > 0)
    .withMessage('Product ID must be greater than 0'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantity ID must be a number')
    .custom((value) => value > 0)
    .withMessage('Quantity must be greater than 0')
];

exports.validateResult = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors
      .array()
      .map(({ msg }) => {
        msg;
      })
      .join('. ');

    return next(new AppError(400, errorMsg));
  }

  next();
});
