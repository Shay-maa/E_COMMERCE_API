const ApiErrors = require("../utils/apiErrors");

// @desc   for explanation the error for developers
const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack, ///to know which line that makes error
  });
};

// @desc   for explanation the error for users
const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const handelJwtInvalidSignature = () =>
  new ApiErrors(" Invalid token, please login again", 401);

const handelJwtExpired = () =>
  new ApiErrors("Expired token, please login again", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handelJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handelJwtExpired();
    sendErrorForProd(err, res);
  }
};

module.exports = globalError;
