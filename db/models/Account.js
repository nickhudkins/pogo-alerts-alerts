const logger = require('../../logging');
const moment = require('moment');

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
    this._timeUntilDown = timeoutMS;
    this._tick = null;
    this._beginTimeout();
  }

  _beginTimeout() {
    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => {
      // If we hit the timeout, we alert, and
      // do mention the area rep.
      this._alertAccountDown(true)
    }, this._timeoutMS);
    clearInterval(this._tick);
    this._tick = setInterval(() => {
      if (!this._isDown) {
        this._timeUntilDown -= 1000;
      }
    }, 1000);
  }

  _alertAccountDown(shouldMention = false) {
    this._isDown = true;
    clearInterval(this._tick);
  }

  didTweet(tweet) {
    this._lastTweet = tweet;
    if (this._isDown) {
      logger.info(`[${this._accountName}] Coming Back Up!`);
    }
    this._isDown = false;
    this._timeUntilDown = this._timeoutMS;
    this._beginTimeout();
  }

  toJSON() {
    const minutes = Math.floor(this._timeUntilDown / 1000 / 60);
    const seconds = ((this._timeUntilDown / 1000) % 60)
    return {
      isDown: this._isDown,
      accountName: this._accountName,
      lastTweet: this._lastTweet,
      alertIntervalMS: this._alertIntervalMS,
      alertMention: this._alertMention,
      timeoutMS: this._timeoutMS,
      timeUntilDown: `${minutes}m ${seconds}s`,
	    lastCheck: this._lastCheck
    };
  }
}
