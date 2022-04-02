//Models
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCart.model');
const { User } = require('../models/user.model');

//Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.cartExist = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  //Find user cart
  const cart = await Cart.find({
    where: { userId: currentUser.id, status: 'active' },
    include: [
      {
        model: Product,
        through: { where: { status: 'active' && 'purchased' } }
      }
    ]
  });

  if (!cart) {
    return next(new AppError(400, 'This user does not have a cart'));
  }

  req.cart = cart;
  next();
});
