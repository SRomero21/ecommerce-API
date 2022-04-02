const express = require('express');

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductsById
} = require('../controllers/product.controller');

//Middlewares
const { validateSession } = require('../middlewares/auth.middleware');
const {
  productExist,
  productOwner
} = require('../middlewares/product.middleware');

const {
  createProductValidator,
  validateResult
} = require('../middlewares/validators.middleware');

const router = express.Router();

router.use(validateSession);

router
  .route('/')
  .post(createProductValidator, validateResult, createProduct)
  .get(getAllProducts);

router
  .use('/:id', productExist)
  .route('/:id')
  .get(getProductsById)
  .patch(productOwner, updateProduct)
  .delete(productOwner, deleteProduct);

module.exports = { productRouter: router };
