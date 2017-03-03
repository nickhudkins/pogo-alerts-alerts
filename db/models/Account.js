const logger = require('../../logging');
const moment = require('moment');
const sendAlert = require('../../alerts/sendAlert');

module.exports = class Account {
  constructor({ accountName, timeoutMS, alertIntervalMS, alertMention }) {
    this._accountName = accountName;
    this._timeoutMS = timeoutMS;
    this._alertIntervalMS = alertIntervalMS;
    this._alertMention = alertMention;
    this._lastTweet = {
      accountName,
      createdAt: moment().format('ddd MMM DD HH:mm:ss:SS Z YYYY'),
      text: 'FAKE_TWEET'
    };
    this._timeout = null;
    this._alertReminder = null;
    this._isDown = false;
    this._beginTimeout();
  }

  _beginTimeout() {
    clearTimeout(this._timeout);
    clearInterval(this._alertReminder);
    this._timeout = setTimeout(() => {
      this._alertAccountDown()
    }, this._timeoutMS);
  }

  _alertAccountDown() {
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
	    lastCheck: this._lastCheck
    };
  }
}
