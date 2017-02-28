const logger = require('../logging');
const Twit = require('twit');

const config = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
};

const onConnect = () => {
  logger.info(`TweetStream Listening...`);
}

const onClose = () => {
  logger.info(`TweetStream Closed.`)
}

const onError = (err) => {
  logger.error(`TweetStream Errored\n ${err}`)
}

module.exports = (accountName) => {
  const normalizedAccountName = accountName.toLowerCase();
  const T = new Twit(config);
  const userStream = T.stream('user', { with: normalizedAccountName });
  userStream.on('error', onError);
  userStream.on('close', onClose);
  userStream.on('connected', onConnect);
  return userStream;
}
