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
    const message = process.env.WEBHOOK_MESSAGE || `
**${payload.accountName}** appears to be down. The last tweet was ${moment.utc(payload.lastTweet.createdAt, 'ddd MMM DD HH:mm:ss:SS Z YYYY').fromNow()}.
* <${payload.alertMention}>:
	* The twitter account may be locked. Please check when you get a chance.
	* If the twitter account isn't locked, please check the map to see if anything is showing.
* <@6906>:
	* Check the scan instances if they failed
----------------------------------


`;
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
  if (process.env.SEND_WEBHOOK === 'true') {
    startPost(account);
  }
}
