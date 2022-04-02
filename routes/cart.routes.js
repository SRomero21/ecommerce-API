const express = require('express');

//Controllers
const {
  addProduct,
  getActiveCart,
  deleteProductCart,
  updateCart,
  purchaseCart
} = require('../controllers/cart.controller');

//Middlewares
const { validateSession } = require('../middlewares/auth.middleware');

const {
  addProductToCartValidation,
  validateResult
} = require('../middlewares/validators.middleware');

const router = express.Router();

router.use(validateSession);

router.get('/', getActiveCart);

router.post(
  '/add-product',
  addProductToCartValidation,
  validateResult,
  addProduct
);

router.patch('/update-cart', updateCart); //--> Increment/decrement quantity

router.delete('/:productId', deleteProductCart);

router.post('/purchase', purchaseCart);

module.exports = { cartRouter: router };
