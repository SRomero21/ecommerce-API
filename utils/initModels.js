//Models
const { User } = require('../models/user.model');
const { Cart } = require('../models/cart.model');
const { Order } = require('../models/order.model');
const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCart.model');

const initModels = () => {
  //1User -> M Products
  User.hasMany(Product);
  Product.belongsTo(User);
  //1 User --> M Order
  User.hasMany(Order);
  Order.belongsTo(User);
  //1 User --> 1 Cart
  User.hasOne(Cart);
  Cart.belongsTo(User);
  //M Carts --> M Products
  Cart.belongsToMany(Product, { through: ProductInCart });
  Product.belongsToMany(Cart, { through: ProductInCart });
  //1 Cart --> 1 Order
  Cart.hasOne(Order);
  Order.belongsTo(Cart);
};

module.exports = { initModels };
