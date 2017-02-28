const logger = require('../logging');
const request = require('request');
const moment = require('moment');

const doPost = (payload, shouldMention) => {
  return new Promise((resolve, reject) => {
    const mention = shouldMention ? 'Hey @' + payload.alertMention + ', ' : 'Hey, ';
    request.post(process.env.WEBHOOK_URL || 'http://requestb.in/1l6vfjn1', {
      json: {
        username: 'Twitter Listener',
        content: `${mention}**${payload.accountName}** has been down for over an hour. The last tweet was ${moment.utc(payload.lastTweet.createdAt, 'ddd MMM DD HH:mm:ss:SS Z YYYY').fromNow()}. Check on it ASAP!`
      }
    }, (err, resp) => {
      if (err) reject(err);
      resolve();
    });
  })
}

module.exports = (account, shouldMention = false) => {
  const { accountName } = account;
  logger.info('======================================');
  logger.info(`${accountName}, appears to be down.`);
  logger.info('======================================');
  logger.info('');
  logger.info('');
  doPost(account, shouldMention);
}
