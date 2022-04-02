//Models
const { Order } = require('../models/order.model');
const { User } = require('../models/user.model');
const { Cart } = require('../models/cart.model');

//Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { Product } = require('../models/product.model');

exports.orderExist = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { id } = req.params;

  //Find user order
  const order = await Order.findOne({
    where: { userId: currentUser.id, status: 'active', id: id },
    include: [
      {
        model: Cart,
        attributes: {
          where: { status: 'purchased', userId: currentUser.id }
        }
      }
    ]
  });

  if (!order) {
    return next(new AppError(400, 'Order not found with the given ID'));
  }

  req.order = order;
  next();
});
