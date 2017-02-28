const logger = require('../../logging');
const moment = require('moment');
const sendAlert = require('../../alerts/sendAlert');

const HOUR = 1000 * 60;
const HALF_HOUR = HOUR / 2

module.exports = class Account {
  constructor({ accountName, timeoutMS = HALF_HOUR, alertIntervalMS = HOUR }) {
    this._accountName = accountName;
    this._timeoutMS = timeoutMS;
    this._alertIntervalMS = alertIntervalMS;
    this._lastTweet = null;
    this._timeout = null;
    this._alertReminder = null;
  }

  _beginTimeout() {
    clearTimeout(this._timeout);
    clearInterval(this._alertReminder);
    this._timeout = setTimeout(() => {
      this._alertAccountDown()
    }, this._timeoutMS);
  }

  _alertAccountDown() {
    /* We have yet to see a tweet so we have
     * no idea if it is actually down.
     */
    if (this._lastTweet === null) return;
    sendAlert(this._lastTweet);
    this._alertReminder = setInterval(() => {
      sendAlert(this.toJSON());
    }, this._alertIntervalMS);
  }

  didTweet(tweet) {
    this._lastTweet = tweet;
    logger.info(`DidTweet[${tweet.accountName}]: ${tweet.createdAt}`);
    this._beginTimeout();
  }

  toJSON() {
    return {
      accountName: this._accountName,
      lastTweet: this._lastTweet,
      alertIntervalMS: this._alertIntervalMS,
      timeoutMS: this._timeoutMS,
    };
  }
}