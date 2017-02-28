const _ = require('lodash');
const accounts = require('../config');

// Builds a list of watched twitter accounts.
const accountsWatched = accounts
                          .filter(({ watching }) => watching)
                          .map(({ accountName }) => accountName);

module.exports = (tweet) => {
  /* This is simply ensuring safe property access.
   * we may get events that are not the shape we expect,
   * this will allow us to know if we're good to keep moving.
   */
  const accountName = _.get(tweet, 'user.screen_name', '').toLowerCase();

  // Do nothing if it isn't a watched account.
  if (!accountsWatched.includes(accountName)) return Promise.resolve();

  // We don't need much, so we'll return our own object.
  const { created_at: createdAt, text } = tweet;
  return Promise.resolve({
    accountName,
    createdAt,
    text,
  });
}
