var request = require('request');
var log = require('./log')(module);
var ApiError = require('./error').ApiError;

/**
 * replacement for request.* methods, JSON-wrapper + User-Agent + Content-Type
 * @param method
 * @returns {Function}
 */
function makeMethod(method) {

  return function(options, callback) {

    if (typeof options != 'object') {
      options = {url:options}
    }

    if (!options.headers) options.headers = {};
    if (!options.headers['User-Agent']) options.headers['User-Agent'] = 'Plunk-App (https://github.com/iliakan/plunk.git)';
    if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json;charset=UTF-8';
    if (!options.json) options.json = true;

    return request[method](options, function(error, response, body) {
      if (body.invalid)
        log.debug(body.invalid)

      callback(error, response, body);
    });
  }
}

exports.get = makeMethod('get');
exports.post = makeMethod('post');
exports.del = makeMethod('del');
exports.put = makeMethod('put');
