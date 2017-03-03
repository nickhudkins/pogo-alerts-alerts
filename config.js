const MINUTES = 1000 * 60;
const HOURS = 60 * MINUTES;
const GoogleSpreadsheet = require('google-spreadsheet');
/*
 * We make sure that whatever is entered is transformed
 * to lowercase so that we can predictably find things
 * without needing IDs, since the accountName will function
 * as such here.
 */
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
            const [ sheet ] = info.worksheets;
            sheet.getRows({
              offset: 1,
              limit: 100
            }, (err, rows) => {
              if (err) reject(err);
              const accountConfig = rows.map(({ twitterurl , timeout = 1 * HOURS , alertinterval = .25 * MINUTES , arearep }) => {
                  const accountName = twitterurl.replace('https://twitter.com/', '');
                  return {
                    accountName,
                    timeoutMS: parseInt(timeout, 10),
                    alertIntervalMS: parseInt(alertinterval, 10),
                    alertMention: arearep,
                  };
              });
              resolve(accountConfig);
            });
          }
        })
      });
    } catch (e) {
      reject(e);
    }
  })
}
