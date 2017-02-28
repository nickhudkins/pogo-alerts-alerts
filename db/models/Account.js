const logger = require('../../logging');
const moment = require('moment');
const sendAlert = require('../../alerts/sendAlert');

const HOUR = 1000 * 60;
const HALF_HOUR = HOUR / 2

module.exports = class Account {
  constructor({ accountName, timeoutMS = HALF_HOUR, alertIntervalMS = HOUR, alertMention }) {
    this._accountName = accountName;
    this._timeoutMS = timeoutMS;
    this._alertIntervalMS = alertIntervalMS;
    this._alertMention = alertMention;
    this._lastTweet = null;
    this._timeout = null;
    this._alertReminder = null;
    this._isDown = false;
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
    this._isDown = true;
    sendAlert(this.toJSON(), true);
    this._alertReminder = setInterval(() => {
      sendAlert(this.toJSON());
    }, this._alertIntervalMS);
  }

  didTweet(tweet) {
    this._lastTweet = tweet;
    this._isDown = false;
    logger.info(`DidTweet[${tweet.accountName}]: ${tweet.createdAt}`);
    this._beginTimeout();
  }

  toJSON() {
    return {
      isDown: this._isDown,
      accountName: this._accountName,
      lastTweet: this._lastTweet,
      alertIntervalMS: this._alertIntervalMS,
      alertMention: this._alertMention,
      timeoutMS: this._timeoutMS,
    };
  }
}
