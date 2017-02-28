const logger = require('../logging');
const verifyTweet = require('./verifyTweet');
const db = require('../db');

module.exports = (stream) => {
  const onTweet = (tweet) => {
    verifyTweet(tweet)
      .then((tweet) => {
        if (tweet) {
          logger.info(`VerifiedTweet[${tweet.accountName}]: ${tweet.text}`);
          const { accountName } = tweet;
          db.accounts
            .getByAccountName(accountName)
            .then((account) => account.didTweet(tweet))
            .catch(err => logger.error(err));
        }
      })
      .catch(err => logger.error(err));
  }
  stream.on('tweet', onTweet);
}
