var login = require('./login');
var config = require('../config');

describe("Login", function() {

  before(function() {
    if (!process.env.GITHUB_USERNAME || !process.env.GITHUB_PASSWORD) {
      throw new Error("Test requires env.GITHUB_USERNAME and env.GITHUB_PASSWORD to be set.")
    }
  });

  describe("Given username and password", function() {
    it("logs in and saves auth to config", function(done) {
      config.clear("auth");
      login(function(error, auth) {
        // prompt module should not await any more input from user

        auth.should.be.type('object');
        auth.should.be.eql(config.get('auth'));
        done();
      });

    });
  })

});