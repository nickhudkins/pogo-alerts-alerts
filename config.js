const MINUTES = 1000 * 60;
const HOURS = 60 * MINUTES;
const GoogleSpreadsheet = require('google-spreadsheet');

module.exports = () => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_KEY)
      const creds = {
        client_email: process.env.GOOGLE_SERVICE_EMAIL,
        private_key: process.env.GOOGLE_DRIVE_API_PRIVATE_KEY,
      }
      if (!creds.private_key) {
        try {
          creds.private_key = require('./google.private.json').private_key
        } catch (e) {
            throw new Error('CREDENTIALS_COULD_NOT_BE_SET');
        }
      }
      doc.useServiceAccountAuth(creds, () => {
        doc.getInfo((err, info) => {
          if (err) reject(err);
          if (!err) {
            const [ sheet ] = info.worksheets.filter(({ title }) => title === 'Master');
            const [ areaReps ] = info.worksheets.filter(({ title }) => title === 'AreaReps');
            sheet.getRows({
              offset: 1,
              limit: 1000
            }, (err, rows) => {
              if (err) reject(err);
			        const timeoutSetting = process.env.TIMEOUT || 1 * HOURS;
			        const alertintervalSetting = process.env.ALERT_INTERVAL || .25 * MINUTES;
              areaReps.getRows({
                offset: 1,
                limit: 1000
              }, (err, areaRepRows) => {
                const accountConfig = rows.map(({ twitterurl , timeout = timeoutSetting , alertinterval = alertintervalSetting , arearep }) => {
                    const accountName = twitterurl.replace('https://twitter.com/', '');
                    const alertMention = areaRepRows.filter(({ discordhandle, mentionids }) => {
                      return discordhandle.toLowerCase() === arearep.toLowerCase()
                    })[0].mentionids;
                    return {
                      accountName,
                      timeoutMS: parseInt(timeout, 10),
                      alertIntervalMS: parseInt(alertinterval, 10),
                      alertMention,
                    };
                });
                resolve(accountConfig);
              })

            });
          }
        })
      });
    } catch (e) {
      reject(e);
    }
  })
}
