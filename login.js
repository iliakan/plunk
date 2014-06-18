var fs = require('fs');
var config = require('config');
var prompt = require('prompt');
var requestJson = require('./utils/requestJson');
var async = require('async');
var debug = require('debug')('plunk:index');
var ApiError = require('./error').ApiError;

function readCredentials(callback) {
  prompt.message = "";
  prompt.delimiter = "";

  prompt.start();

  prompt.get([
    {
      name: 'username',
      description: 'GitHub Login:',
      required: true
    },
    {
      name: 'password',
      description: 'GitHub Password:',
      hidden: true,
      conform: function() {
        return true;
      }
    }
  ], callback);

}

/**
 * Read auth token from GitHub
 *
 * Prerequisite: login to plunker from GitHub
 * @param auth GitHub {username:..., password:...}
 * @param callback Calls callback(err, token)
 */
function readGithubToken(auth, callback) {

  async.waterfall([
    function(callback) {
      var url = 'https://api.github.com/authorizations';
      requestJson.get({
        url: url,
        auth: auth
      }, function(error, response, json) {
        if (response.statusCode == 401) {
          return callback(new ApiError("Wrong GitHub Login or Password"));
        } else if (response.statusCode != 200) {
          return callback(new ApiError(url +":" + response.statusCode))
        }
        callback.apply(null, arguments);
      });
    },
    function(response, authorizations, callback) {

      for (var i = 0; i < authorizations.length; i++) {
        var authorization = authorizations[i];
        if (authorization.app.name != 'Plunker') continue;
        return callback(null, authorization.token)
      }

      callback(new ApiError("Please login on Plunker with GitHub first (no authorization)"));
    }
  ], callback);

}

function readPlnkrSessId(githubToken, callback) {
  var session;
  async.waterfall([
    function(callback) {
      requestJson.get({ url: 'http://api.plnkr.co/sessions' }, callback)
    }, function(response, sessionData, callback) {
      session = sessionData;

      requestJson.post({
        url: session.user_url,
        body: JSON.stringify({
          service: "github",
          token: githubToken
        })
      }, callback)
    },
    function(response, auth, callback) {
      if (response.statusCode != 201) {
        debug(response, auth);
        return new ApiError("Incorrect response from " + session.user_url);
      }
      callback(null, session.id);
    }
  ], callback);
}

function login(callback) {
  async.waterfall([
    readCredentials,
    readGithubToken,
    readPlnkrSessId,
    function(sessId, callback) {
      config.set("sessId", sessId);
      config.save(callback);
    }
  ], callback)
}

module.exports = login;