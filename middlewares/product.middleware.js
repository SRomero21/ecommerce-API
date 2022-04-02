//Models
const { Product } = require('../models/product.model');
const { User } = require('../models/user.model');
//Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.productExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: { status: 'active', id },
    include: { model: User, attributes: { exclude: ['password'] } }
  });

  if (!product) {
    return next(new AppError(404, 'Not product found with the given ID'));
  }

  req.product = product;
  next();
});

exports.productOwner = catchAsync(async (req, res, next) => {
  //Get current session user's ID
  const { currentUser, product } = req;

  //Compare product userId
  if (product.userId !== currentUser.id) {
    return next(new AppError(403, 'You are not the owner of this product'));
  }

  next();
});
