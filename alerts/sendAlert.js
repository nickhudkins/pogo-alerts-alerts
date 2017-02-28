const logger = require('../logging');
const request = require('request');

const doPost = (payload) => {
  return new Promise((resolve, reject) => {
    request.post('https://discordapp.com/api/webhooks/286185098548740096/kQph4c9gkvC99c0ZGUawEOrnQ3h3RHvwX73eOOi_gOhxaogHUSavzQwWHSpTS0QDGa7V', {
		json: {
			username: 'Twitter Listener',
			content: `**${payload.accountName}** has been down for over an hour. The last tweet was ${moment(payload.lastTweet.createdAt).fromNow()}. Check on it ASAP!`
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
