
/**
 * A custom error object that wraps the Error instance with an used-friendly
 * error message.
 *
 * @constructor
 * @param {String} message - user-friendly message for this error
 * @param {Error} originalException - the original exception
 */
export default class CustomError {
  constructor(message, originalException) {
    this.message = message;
    this.originalException = originalException;
  }
}
