const _ = require('lodash');
const db = require('../db');

module.exports = (tweet) => {
  return new Promise((resolve, reject) => {
    /* This is simply ensuring safe property access.
     * we may get events that are not the shape we expect,
     * this will allow us to know if we're good to keep moving.
     */
    const accountName = _.get(tweet, 'user.screen_name', '');

    const accountNames = Object.keys(db.accounts.getAllAsJSON()).map(name => name.toLowerCase());
    if (!accountNames.includes(accountName.toLowerCase())) return Promise.resolve();
        // We don't need much, so we'll return our own object.
    const { created_at: createdAt, text } = tweet;
    resolve({
      accountName,
      createdAt,
      text,
    });
  })
}
