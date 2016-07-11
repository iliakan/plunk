'use strict';

const PlunkError = require('./plunkError');
const log = require('./log')(module);
const request = require('request-promise');

module.exports = class Api {

  constructor({auth}) {
    this.auth = auth;
    if (auth) {
      this.authProvidedExternally = true;
      if (!auth.id) {
        throw new PlunkError("No auth.id");
      }
    }
  }

  getUrl(id) {
    return "http://api.plnkr.co/plunks/" + (id || "");
  }


  *request(options) {

    if (!this.auth) {
      // create new session
      this.auth = yield request({
        url: 'http://api.plnkr.co/sessions',
        method: 'POST',
        json: true
      });
    }

    log.debug(this.auth);
    if (!options.headers) {
      options.headers = {};
    }

    options.headers['User-Agent'] = 'Plunk-App (https://github.com/iliakan/plunk.git)';
    options.headers['Content-Type'] = 'application/json;charset=UTF-8';
    options.headers['Authorization'] = 'token ' + this.auth.id;
    options.json = true;
    options.simple = false;
    options.resolveWithFullResponse = true;

    log.debug("request", options, options.form);

    const response = yield request(options);

    log.debug("response", response.statusCode, response.body);

    if (response.statusCode == 404) {
      if (this.authProvidedExternally) {
        log.debug('request session expired?', this.auth.id);
        let sessTestResponse = yield request({
          url:                     'http://api.plnkr.co/sessions/' + this.auth.id,
          simple:                  false,
          resolveWithFullResponse: true
        });

        log.debug('response ', sessTestResponse.statusCode, sessTestResponse.body);

        if (sessTestResponse.statusCode == 404) {
          throw new PlunkError("Session not exists (expired?): " + this.auth.id);
        } else {
          throw new PlunkError("Plunk not found or not yours (config auth user is different)");
        }
      } else {
        throw new PlunkError("Plunk not found or not yours");
      }
    }

    return response;
  }

  *getPlunk(id) {
    const url = this.getUrl(id);

    let response = yield* this.request({
      url
    });

    if (response.statusCode == 404) {
      return null;
    }

    if (response.statusCode != 200) {
      return PlunkError(`getPlunk ${id}: ${response.statusCode}`);
    }

    return response.body;
  }

  *createPlunk(form) {

    log.debug("createPlunk");
    const url = this.getUrl();

    let response = yield* this.request({url, body: form, method: 'POST'});

    if (response.statusCode != 201) {
      return new PlunkError("createPlunk: " + response.statusCode);
    }

    return response.body;
  }

  *updatePlunk(id, form) {

    const url = this.getUrl(id);

    log.debug("updatePlunk", url);

    let response = yield* this.request({url, method: 'POST', body: form});

    if (response.statusCode != 200) {
      return new PlunkError(`updatePlunk ${id}: ${response.statusCode}`);
    }

    return response.body;
  };

};

