var nconf = require('nconf');
var fs = require('fs');
var homeDir = require('home-dir')();
var path = require('path');

var configFile = path.join(homeDir, '.plunk_config.json');

if (!fs.existsSync(configFile)) {
  fs.writeFileSync(configFile, "{}");
}

nconf.argv()
  .env()
  .use('file', { file: configFile });

module.exports = nconf;