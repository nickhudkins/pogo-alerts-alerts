const _ = require('lodash');
const logger = require('../logging');
const Account = require('./models/Account');
const data = {};

module.exports = {
  accounts: {
    create: ({ accountName, alertMention, timeoutMS, alertIntervalMS }) => {
      const normalizedAccountName = accountName.toLowerCase();
      data[normalizedAccountName] = new Account({
        accountName,
        alertMention,
        timeoutMS,
        alertIntervalMS
      });
      return data[normalizedAccountName];
    },
    getByAccountName: (accountName) => {
      return new Promise((resolve, reject) => {
        const normalizedAccountName = accountName.toLowerCase();
        try {
          resolve(data[normalizedAccountName]);
        } catch (e) {
          reject(e)
        }
      });
    },
    getAllAsJSON: () => {
      /*
       * We don't care about all of the private properties
       * of our accounts, so we'll return their `toJSON` values.
       */
      return _.mapValues(data, (value) => {
        const v = value.toJSON();
        return {
          lastTweet: v.lastTweet.text,
          timeUntilDown: v.timeUntilDown,
          isDown: v.isDown,
          link: `https://twitter.com/${v.accountName}`,
        }
      });
    }
  },
}
