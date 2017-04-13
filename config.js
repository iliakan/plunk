'use strict';

const path = require('path');
const nconf = require('nconf');
const homeDir = require('home-dir')();

nconf
  .argv() // take args first
  .env() // then env vars
  .use('file', { file: path.join(homeDir, '.plunk_config.json') }); // then read from file


module.exports = nconf;

console.log(`Your home dir is ${homeDir}. Make sure .plunk-config.json file is in it.`);