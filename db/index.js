const _ = require('lodash');
const logger = require('../logging');
const accountConfig = require('../config');
const Account = require('./models/Account');
const data = {};

module.exports = {
  accounts: {
    getOrCreate: (accountName) => {
      return new Promise((resolve, reject) => {
        try {
          if (!(accountName in data)) {
            /*
             * This is awfully naive to think we're going to find it,
             * though by this point, it is a watched account so we should
             * be able to find it. Let's go ahead and move along...
             */
            const { timeoutMS, alertIntervalMS } = _.find(accountConfig, { accountName });
            data[accountName] = new Account({ accountName, timeoutMS, alertIntervalMS });
          }
          /*
           * Either we just created it, or it existed, but we
           * go ahead and resolve the promise with the account.
           */
          resolve(data[accountName]);
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
      return _.mapValues(data, (value) => value.toJSON());
    }
  },
}
