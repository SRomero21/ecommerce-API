//Models
const { Product } = require('../models/product.model');

//Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { filterObject } = require('../utils/filterObject');
const { User } = require('../models/user.model');

exports.createProduct = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;

  const { title, description, price, quantity } = req.body;

  const newProduct = await Product.create({
    title,
    description,
    price,
    quantity,
    userId: id
  });

  res.status(201).json({
    status: 'success',
    data: { newProduct }
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: 'active' },
    include: { model: User, attributes: { exclude: ['password'] } }
  });

  res.status(200).json({
    status: 'success',
    data: { products }
  });
});

exports.getProductsById = catchAsync(async (req, res, next) => {
  const { product } = req;

  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  const data = filterObject(
    req.body,
    'title',
    'description',
    'price',
    'quantity'
  );

  await product.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});
