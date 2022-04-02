//Models
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { User } = require('../models/user.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Order } = require('../models/order.model');
//Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

exports.getActiveCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  const cart = await Cart.findOne({
    where: { userId: currentUser.id, status: 'active' },
    include: [
      {
        model: Product,
        through: { where: { status: 'active' } }
      }
    ]
  });

  res.status(202).json({
    status: 'success',
    data: cart
  });
});

exports.addProduct = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId, quantity } = req.body;
  //Check if product to add, does not esxceds the requested amount
  const product = await Product.findOne({
    where: { status: 'active', id: productId }
  });

  if (!product) {
    return next(new AppError(404, `Not a valid product`));
  }

  if (quantity > product.quantity) {
    return next(new AppError(400, `Only ${product.quantity} in stock`));
  }

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    const newCart = await Cart.create({ userId: currentUser.id });

    await ProductInCart.create({
      productId,
      cartId: newCart.id,
      quantity
    });
  } else {
    //Cart already exist
    //Check if product is already in the cart
    const productExist = await ProductInCart.findOne({
      where: { cartId: cart.id, productId }
    });

    if (productExist && productExist.status === 'active') {
      return next(new AppError(400, 'This product is already in the cart'));
    }

    //If product is in the cart but was removen before, add it again
    if (productExist && productExist.status === 'deleted') {
      await productExist.update({ status: 'active', quantity });
    }

    if (!productExist) {
      //Add new product to cart
      await ProductInCart.create({
        cartId: cart.id,
        productId,
        quantity
      });
    }
  }

  res.status(201).json({
    status: 'success'
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId, quantity } = req.body;

  //Check if quantity excedes avaliable stock
  const product = await Product.findOne({
    where: { status: 'active', id: productId }
  });

  if (quantity > product.quantity) {
    return next(
      new AppError(
        400,
        `This product only has ${product.quantity} items in stock`
      )
    );
  }

  //Find user's cart
  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    return next(new AppError(400, 'This user does not have a cart yet'));
  }

  //Find the product in cart requested
  const productInCart = await ProductInCart.findOne({
    where: { status: 'active', cartId: cart.id, productId }
  });

  if (!productInCart) {
    return next(new AppError(404, 'This product is not in the cart'));
  }

  if (quantity === 0) {
    await productInCart.update({ quantity: 0, status: 'deleted' });
  }

  if (quantity > 0) {
    await productInCart.update({ quantity });
  }

  res.status(204).json({ status: 'success' });
});

exports.deleteProductCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId } = req.params;

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    return next(new AppError(404, 'This user does not have an active cart'));
  }

  const productInCart = await ProductInCart.findOne({
    where: { status: 'active', cartId: cart.id, productId }
  });

  if (!productInCart) {
    return next(new AppError(400, 'Cant find product with the given ID'));
  }

  await productInCart.update({
    status: 'deleted'
  });

  res.status(204).json({
    status: 'success'
  });
});

exports.purchaseCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id },
    include: [
      {
        model: Product,
        through: { where: { status: 'active' } }
      }
    ]
  });

  if (!cart) {
    return next(new AppError(404, 'This user does not have a cart'));
  }
  //Get total price of the order
  let totalPrice = 0;

  //Update all products as purchased
  const cartPromises = cart.products.map(async (product) => {
    await product.productInCart.update({ status: 'purchased' });

    //Discount the quantity of the product

    const productPrice = product.price * product.productInCart.quantity;

    totalPrice += productPrice;

    const newQuantity = product.quantity - product.productInCart.quantity;

    return await product.update({ quantity: newQuantity });
  });

  await Promise.all(cartPromises);

  //Mark cart as purchased
  await cart.update({
    status: 'purchased'
  });

  const newOrder = await Order.create({
    userId: currentUser.id,
    cartId: cart.id,
    issuedAt: new Date().toLocaleString(),
    totalPrice
  });

  res.status(201).json({
    status: 'success',
    data: { newOrder }
  });
}); //!Check the map function
