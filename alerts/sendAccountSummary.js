const logger = require('../logging');
const request = require('request');
const moment = require('moment');


const sendAlert = (payload) => {
  const message = process.env.WEBHOOK_MESSAGE || `
  **${payload._accountName}** appears to be down. The last tweet was ${moment.utc(payload._lastTweet.createdAt, 'ddd MMM DD HH:mm:ss:SS Z YYYY').fromNow()}.
  * ${payload._alertMention} :
    * The twitter account may be locked. Please check when you get a chance.
    * If the twitter account isn't locked, please check the map to see if anything is showing.
  * <@!231013798494994432> :
    * Check the scan instances if they failed
  ----------------------------------
  `;
  return new Promise((resolve, reject) => {
    request.post(process.env.WEBHOOK_URL || 'http://requestb.in/1k7k8pf1', {
      json: {
        username: 'PGAN Twitter Listener',
        content: message
      }
    }, (err, resp, body) => {
      if (err) reject(err);
      if ( resp.statusCode === 200 || resp.statusCode === 204 || resp.statusCode === 429) {
        if (resp.body && resp.body.retry_after) resolve({ nextRequestDelay: resp.body.retry_after, limited: true });
        resolve({ nextRequestDelay: 1000, limited: false });
      } else {
        logger.info('WHAT', resp.statusCode, resp.body);
        reject(new Error('UNKNOWN_ERROR'));
      }

    })
  })
}

module.exports = (accounts) => {
  let pendingAlerts = accounts.map((account) => ({ account, numAttempts: 0 }));
  return new Promise((resolve, reject) => {
    function recurseList(list) {
      logger.info(`Remaining to send: ${ list.length }`);
      if (list.length === 0) {
        resolve();
        return;
      }
      let [payload, ...remaining] = list;
      // Check before we are ready to send, it may have come back up.
      if (payload.account._isDown) {
        sendAlert(payload.account)
          .then(({ nextRequestDelay, limited }) => {
            if (limited) {
              payload.numAttempts++
              if (payload.numAttempts < 20) {
                remaining = [payload, ...remaining];
              }
            }
            setTimeout(() => {
              recurseList(remaining.filter(({ account }) => account._isDown ));
            }, nextRequestDelay );
          })
          .catch(e => {
            logger.error(e);
            payload.numAttempts++
            if (payload.numAttempts < 20) {
              remaining = [...remaining, payload];
              setTimeout(() => {
                recurseList(remaining.filter(({ account }) => account._isDown ));
              }, 5000);
            }
          })
      } else {
        recurseList(remaining.filter(({ account }) => account._isDown ));
      }

    }
    recurseList(pendingAlerts);
  })
}
