'use strict';

/**
 * Generic error class for interaction errors
 * These errors are shown to user "as is"
 */
module.exports = class PlunkError extends Error {
  constructor(message) {
    super(message);
    Error.apply(this, arguments);
    Error.captureStackTrace(this, PlunkError);

    this.name = 'PlunkError';
    this.message = message || "Error";
  }
};


