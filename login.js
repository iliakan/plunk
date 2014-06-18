var log = require('./utils/log')(module);

var config = require('./config');
var readLine = require('./utils/readLine');
var requestJson = require('./utils/requestJson');
var async = require('async');
var ApiError = require('./utils/error').ApiError;

function readCredentials(callback) {
  log.debug("readCredentials");

  if (process.env.GITHUB_USERNAME && process.env.GITHUB_PASSWORD) {
    return callback(null, {
      username: process.env.GITHUB_USERNAME,
      password: process.env.GITHUB_PASSWORD
    });
  }

  async.series({
      username: function(callback) {
        process.stdout.write('Hi there! We need to establish an auth session with plunker first (only one time).\n1) Log in (sign up if needed) to http://github.com, please.\n2) And then go to http://plnkr.co and log in using GitHub (upper-right corner).\n3) And finally enter GitHub login/password here (will not give anyone, will not store anywhere).\n');
        readLine({message: 'GitHub Login: '}, callback);
      },
      password: function(callback) {
        readLine({message: 'GitHub Password: ', hidden: true}, callback);
      }
    }, callback);

}

/**
 * Read auth token from GitHub
 *
 * Prerequisite: login to plunker from GitHub
 * @param auth GitHub {username:..., password:...}
 * @param callback Calls callback(err, token)
 */
function readGithubToken(auth, callback) {
  log.debug("readGithubToken");

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

function readPlnkrAuth(githubToken, callback) {
  log.debug("readPlnkrAuth");

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
        log.debug(response, auth);
        return new ApiError("Incorrect response from " + session.user_url);
      }
      callback(null, auth);
    }
  ], callback);
}

function login(callback) {
  async.waterfall([
    readCredentials,
    readGithubToken,
    readPlnkrAuth,
    function(auth, callback) {
      config.set("auth", auth);
      config.save(function(err) {
        if (err) return callback(err);
        callback(null, auth);
      });
    }
  ], callback)
}

module.exports = login;