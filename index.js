var login = require('login');
var config = require('config');


login(function(error) {
  // prompt module should not await any more input from user
  process.stdin.destroy();

  console.log(arguments);
  console.log("DONE")
});