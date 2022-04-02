const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
//Controllers
const { globalErrorHandler } = require('./controllers/error.controller');

//Routes
const { userRouter } = require('./routes/user.routes');
const { productRouter } = require('./routes/product.routes');
const { cartRouter } = require('./routes/cart.routes');

const app = express();

app.use(express.json());

//Limit the times the users request to our server
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: 'Too many request from your IP, try later'
  })
);
//Security headers
app.use(helmet());
//Response api
app.use(compression());
//Log request
app.use(morgan('dev'));

//Endpoints
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/cart', cartRouter);

//Error handler
app.use(globalErrorHandler);

module.exports = { app };

//Random json web token
//const crypto = require('crypto').randomBytes(50).toString('hex')
