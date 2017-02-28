const { PORT = 5000 } = process.env;
const logger = require('./logging');
const express = require('express');
const bodyParser = require('body-parser');

const db = require('./db');
const getConfig = require('./config');
const createListener = require('./twitter/createListener');
const watchStream = require('./twitter/watchStream');

const app = express();
app.use(bodyParser.json());

const streamAccountName = process.env.STREAM_USER || 'pganalert';

getConfig().then(accountConfig => {
  /*
   * We fill the database immediately because there is no reason not to.
   * this means our `/status` page will have account regardless of if they
   * have tweeted or not. This is a good thing.
   */
  accountConfig.forEach((accountData) => {
    db.accounts.create(accountData);
  })

  const stream = createListener(streamAccountName);
  watchStream(stream);
})

app.get('/keep-alive', (req, res) => res.json({ status: 'awake' }));
app.get('/status', (req, res) => res.json(db.accounts.getAllAsJSON()));

app.listen(PORT, (err) => {
  if (err) logger.error(err);
  logger.info('Server Listening...');
})
