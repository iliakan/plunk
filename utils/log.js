var winston = require('winston');

module.exports = function(module) {
  return makeLogger(module.filename);
};

function makeLogger(path) {


  if (path.match(/DEBUG_PATH_HERE/)) {

    var transports = [

      new winston.transports.Console({
        timestamp: true,
        colorize: true,
        level: 'debug'
      })

    ];

    return new winston.Logger({ transports: transports });

  } else {

    return new winston.Logger({
      transports: []
    });

  }
}
