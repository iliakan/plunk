var requestJson = require('./utils/requestJson');
var ApiError = require('./utils/error').ApiError;

function Api(auth) {

  function getUrl(id) {
    return "http://api.plnkr.co/plunks/" + (id || "") + "?sessid=" + auth.id;
  }

  this.getPlunk = function(id, callback) {
    var url = getUrl(id);
    requestJson.get(url, function(error, response, plunk) {
      if (response.statusCode == 404) {
        return callback(null, null);
      }
      if (response.statusCode != 200) {
        return callback(new ApiError("getPlunk " + id +": " + response.statusCode));
      }
      callback(error, plunk);
    });

  };

  this.createPlunk = function(form, callback) {

    var url = getUrl();

    requestJson.post({ url: url, body: JSON.stringify(form) }, function(error, response, plunk) {
      if (response.statusCode != 201) {
        return callback(new ApiError("createPlunk " + id +": " + response.statusCode));
      }

      callback(null, plunk);
    });
  };

  this.updatePlunk = function(id, form, callback) {

    var url = getUrl(id);

    requestJson.post({ url: url, body: JSON.stringify(form) }, function(error, response, plunk) {
      if (response.statusCode != 200) {
        return callback(new ApiError("updatePlunk " + id +": " + response.statusCode));
      }

      callback(null, plunk);
    });
  };

}

exports.PlnkrApi = Api;
