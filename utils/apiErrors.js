// @desc this class is responsible about operational Errors
class ApiErrors extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "failed" : "error";
    this.isOperational = true;
  }
}
module.exports = ApiErrors;
