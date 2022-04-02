const express = require('express');

const {
  createUser,
  loginUser,
  getUserProducts,
  updateUser,
  deleteUser,
  userOrders,
  userOrderById,
  getAllUsers
} = require('../controllers/user.controller');

//Middlewares
const { validateSession } = require('../middlewares/auth.middleware');

const {
  userExist,
  protectAccountOwner
} = require('../middlewares/user.middleware');

const {
  createUserValidators,
  validateResult
} = require('../middlewares/validators.middleware');

const { orderExist } = require('../middlewares/order.middeware');

const router = express.Router();

router.post('/', createUserValidators, validateResult, createUser); //--> Create user

router.post('/login', loginUser); //--> Login user

router.use(validateSession);

router.get('/', getAllUsers);

router.get('/me', getUserProducts); //--> User profile

router.patch('/:id', userExist, protectAccountOwner, updateUser); // --> Update user (username and email)

router.delete('/:id', userExist, protectAccountOwner, deleteUser); // --> Delete user

router.get('/orders', userOrders); // --> Get ALL user purchases

router.get('/orders/:id', orderExist, userOrderById); // --> Get user order by id

module.exports = { userRouter: router };
