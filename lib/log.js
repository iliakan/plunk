const winston = require('winston');

module.exports = function(module) {
  return makeLogger(module.filename);
};

function makeLogger(path) {


  if (path.match(/./)) {

    const transports = [

      new winston.transports.Console({
        timestamp: true,
        colorize: true,
        level: process.env.LOG_LEVEL || 'info'
      })

    ];

    return new winston.Logger({ transports: transports });

  } else {

    return new winston.Logger({
      transports: []
    });

  }
}
