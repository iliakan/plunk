var util = require('util');

/**
 * Generic error class for interaction errors
 * These errors are shown to user "as is"
 * @param status
 * @param message
 * @constructor
 */
function ApiError(status, message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, ApiError);

  this.status = status;
  this.message = message || "Error";
}

util.inherits(ApiError, Error);

ApiError.prototype.name = 'ApiError';

exports.ApiError = ApiError;



