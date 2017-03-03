const logger = require('../logging');
const request = require('request');
const moment = require('moment');

const maximumRetries = 20
const retryDelay = 10000

const startPost = (payload) => {
  payload.attempt = 0; // Initialize attempt counter
  return new Promise((resolve, reject) => {
    doPost(payload, resolve, reject);
  })
}

const doPost = (payload, resolve, reject) => {
  if (payload.attempt < maximumRetries) {
    const message = process.env.WEBHOOK_MESSAGE || `**${payload.accountName}** appears to be down. The last check was ${moment.utc(payload.lastTweet.createdAt, 'ddd MMM DD HH:mm:ss:SS Z YYYY').fromNow()}.`;
    console.log(message);
    request.post(process.env.WEBHOOK_URL || 'http://requestb.in/xxch05xx', {
      json: {
        username: 'PGAN Twitter Listener',
        content: message
      }
    }, (err, resp, body) => {
      /*
	   * Check for success messages. If unsuccessful try again a little later.
	   */
      if (resp.statusCode != 200 && resp.statusCode != 204) {
        setTimeout(() => {
          payload.attempt++;
          doPost(payload, resolve, reject);
        }, retryDelay);
      }
      else {
        resolve();
      }
    });
  }
  else {
    reject('Exceeded the maximum amount of retries for **${payload.accountName}**. Alert could not be sent.');
  }
}

module.exports = (account) => {
  const { accountName } = account;
  logger.info('======================================');
  logger.info(`${accountName}, appears to be down.`);
  logger.info('======================================\n\n');
  startPost(account);
}
