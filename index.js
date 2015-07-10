'use strict';

var util = require('util');
var debug = require('debug')('node-errors');
var stringify = require('json-stringify-safe');

/**
 * Common error with message and custom code
 * @param {String} message - error message
 * @param {Number} code    - response status code, defaults to 400
 */
function CommonError(message, code) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.message = message;
  this.statusCode = this.code = code || 400;

  return this;
}
util.inherits(CommonError, Error);

/**
 * Enables Error object to be serialized
 * @return {Object}
 */
Object.defineProperty(CommonError.prototype, 'toJSON', {
    value: function () {
        var alt = {};

        Object.getOwnPropertyNames(this).forEach(function (key) {
            alt[key] = this[key];
        }, this);

        return alt;
    },
    configurable: true
});

/**
 * Authentication Error
 * @param {String} message - defaults to 'Not authorized'
 */
function AuthError(message) {
  CommonError.call(this, message || 'Not authorized', 401);
  return this;
}
util.inherits(AuthError, CommonError);


/**
 * Access Forbidden Error
 * @param {String} message - defaults to `Forbidden`
 */
function ForbiddenError(message) {
  CommonError.call(this, message || 'Forbidden', 403);
  return this;
}
util.inherits(ForbiddenError, CommonError);


/**
 * Resource Not Found Error
 * @param {String} message - defaults to `Not Found`
 */
function NotFoundError(message) {
  CommonError.call(this, message || 'Not Found', 404);
  return this;
}
util.inherits(NotFoundError, CommonError);


/**
 * Bad Request Error
 * @param {String|Object} payload - details of the error
 */
function BadRequestError(payload) {
  CommonError.call(this, 'Bad Request', 400);
  this.data = payload;
  return this;
}
util.inherits(BadRequestError, CommonError);


/**
 * Uninitialized Error
 */
function UninitializedError() {
  CommonError.call(this, 'Uninitialized', 500);
  return this;
}
util.inherits(UninitializedError, CommonError);


/**
 * Uninitialized Error
 */
function InternalError(message) {
  CommonError.call(this, message || 'Internal Server Error', 500);
  return this;
}
util.inherits(InternalError, CommonError);



/**
 * Middleware for sending errors based on passed error
 * @param {Error}    err  - error object
 * @param {Object}   req  - http request
 * @param {Object}   res  - http response
 * @param {Function} next - next
 */
function commonErrorHandler(err, req, res, next) { // jshint ignore:line

  debug(err);

  // if we got here without an error, it's a 404 case
  if (!err) {
    err = new NotFoundError();
  }

  // here we've got an error, it could be a different one than
  // the one we've constructed, so provide defaults to be safe
  err.message = err.message || 'Internal Server Error';

  res
    .status(err.code || err.statusCode || 500)
    .type('application/json')
    .send(stringify(err));
}

/**
 * Public API
 * @type {Object}
 */
module.exports = {
  Common: CommonError,
  Auth: AuthError,
  Forbidden: ForbiddenError,
  NotFound: NotFoundError,
  BadRequest: BadRequestError,
  Uninitialized: UninitializedError,
  Internal: InternalError,
  commonErrorHandler: commonErrorHandler
};
