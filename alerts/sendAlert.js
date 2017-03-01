const logger = require('../logging');
const request = require('request');
const moment = require('moment');

const doPost = (payload) => {
  return new Promise((resolve, reject) => {
	const lastTweetText = 'never found';
	if (payload.lastTweet) {
		lastTweetText = moment(payload.lastTweet.createdAt).fromNow();
	}
	  
    request.post(process.env.WEBHOOK_URL || 'http://requestb.in/xxch05xx', {
		json: {
			username: 'Twitter Listener',
			content: `@everyone **${payload.accountName}** appears to be down. The last tweet was ${lastTweetText}. Check on it ASAP!`
		}			
    }, (err, resp) => {
      if (err) reject(err);
      resolve();
    });
  })
}

module.exports = (account) => {
  const { accountName } = account;
  logger.info('======================================');
  logger.info(`${accountName}, appears to be down.`);
  logger.info('======================================\n\n');
  doPost(account);
}
