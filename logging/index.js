const winston = require('winston');
require('winston-papertrail').Papertrail;

const {
  LOGGING_HOST,
  LOGGING_PORT,
  LOG_HOST_NAME = 'pogo-alerts-alerts',
} = process.env;

const transports = [
  new winston.transports.Console(),
];

if (LOGGING_HOST && LOGGING_PORT) {
  const winstonPapertrail = new winston.transports.Papertrail({
    host: process.env.LOGGING_HOST,
    port: process.env.LOGGING_PORT,
    hostname: process.env.LOG_HOST_NAME
  })
  transports.push(winstonPapertrail);
}

module.exports = new winston.Logger({ transports });
