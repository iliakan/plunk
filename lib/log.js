const winston = require('winston');

module.exports = function(module) {
  return makeLogger(module.filename);
};

function makeLogger(path) {


  if (path.match(/./)) {

    const transports = [

      new winston.transports.Console(convertOptionsToWinstonV3({
        timestamp: true,
        colorize: true,
        level: process.env.LOG_LEVEL || 'error'
      }))

    ];

    return winston.createLogger({ transports: transports });

  } else {

    return winston.createLogger({
      transports: []
    });

  }
}

function convertOptionsToWinstonV3(opts) {
  const newOpts = {};
  const formatArray = [];
  const formatOptions = {
    stringify: () => winston.format((info) => { info.message = JSON.stringify(info.message); })(),
    formatter: () => winston.format((info) => { info.message = opts.formatter(Object.assign(info, opts)); })(),
    json: () => winston.format.json(),
    raw: () => winston.format.json(),
    label: () => winston.format.label(opts.label),
    logstash: () => winston.format.logstash(),
    prettyPrint: () => winston.format.prettyPrint({depth: opts.depth || 2}),
    colorize: () => winston.format.colorize({level: opts.colorize === true || opts.colorize === 'level', all: opts.colorize === 'all', message: opts.colorize === 'message'}),
    timestamp: () => winston.format.timestamp(),
    align: () => winston.format.align(),
    showLevel: () => winston.format((info) => { info.message = info.level + ': ' + info.message; })()
  }
  Object.keys(opts).filter(k => !formatOptions.hasOwnProperty(k)).forEach((k) => { newOpts[k] = opts[k]; });
  Object.keys(opts).filter(k => formatOptions.hasOwnProperty(k) && formatOptions[k]).forEach(k => formatArray.push(formatOptions[k]()));
  newOpts.format = winston.format.combine(...formatArray);
  return newOpts;
}
