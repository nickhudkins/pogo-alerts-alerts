const _ = require('lodash');
const logger = require('../logging');
const accountConfig = require('../config');
const Account = require('./models/Account');
const data = {};

module.exports = {
  accounts: {
    init:  () => {
        logger.info(`Initializing ${accountConfig.length} accounts...`);
        /*
         * Grab all accounts from config and place in data array
         * for later use.
         */
        _.each(accountConfig, (account, key) => {
            const { accountName, timeoutMS, alertIntervalMS } = account;
            data[accountName] = new Account({ accountName, timeoutMS, alertIntervalMS });
        });
    },
    getOrCreate: (accountName) => {
      return new Promise((resolve, reject) => {
        try {
          /*
           * Go ahead and resolve the promise with the account.
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
