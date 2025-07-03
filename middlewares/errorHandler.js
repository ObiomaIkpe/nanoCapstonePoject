const CustomError = require('../utils/customError');

const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    message: isProduction ? 'Something went wrong. Please try again.' : message,
  };

  if (!isProduction) {
    response.stack = err.stack;
    response.error = err; // Optional: include full error object in dev
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
