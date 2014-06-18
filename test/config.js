var fs = require('fs');
var assert = require("assert");

describe('config', function() {
  var file = "/tmp/plunk_config";

  it("Creates config file", function(done) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }

    var config = require('config');
    config.use('file', {file: file});

    assert.equal(config.sessId, null);

    config.set("sessId", "123");

    config.save(function(err) {
      if (err) return done(err);

      assert.deepEqual(JSON.parse(fs.readFileSync(file)), {sessId: 123});
      fs.unlinkSync(file);
      done();
    });
  });

});