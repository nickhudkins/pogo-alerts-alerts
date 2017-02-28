const MINUTES = 1000 * 60;
const HOURS = 60 * MINUTES;

/*
 * You may add accounts here. You can turn them on or off,
 * by setting watching to `true` or `false`. You can also
 * adjust what is considered "DOWN" by setting `timeoutMS`.
 * Adjust `alertIntervalMS` to adjust how often you are alerted
 * while the account is down.
 */
const accounts = [{
  accountName: 'PGANMDBMoreCity',
  watching: true,
  timeoutMS: 0.5 * MINUTES,
  alertIntervalMS: 0.25 * MINUTES,
}];

/*
 * We make sure that whatever is entered is transformed
 * to lowercase so that we can predictably find things
 * without needing IDs, since the accountName will function
 * as such here.
 */
module.exports = accounts.map((obj) => Object.assign({}, obj, { accountName: obj.accountName.toLowerCase() }))
