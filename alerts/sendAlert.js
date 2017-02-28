const logger = require('../logging');
const request = require('request');

const doPost = (payload) => {
  return new Promise((resolve, reject) => {
    request.post(process.env.WEBHOOK_URL || 'http://requestb.in/xxch05xx', {
      body: JSON.stringify(payload),
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
