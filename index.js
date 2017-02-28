const { PORT = 5000 } = process.env;
const logger = require('./logging');
const express = require('express');
const bodyParser = require('body-parser');

const db = require('./db');
const createListener = require('./twitter/createListener');
const watchStream = require('./twitter/watchStream');

const app = express();
app.use(bodyParser.json());

const streamAccountName = process.env.STREAM_USER || 'pganalert';
const stream = createListener(streamAccountName);
watchStream(stream);

app.get('/keep-alive', (req, res) => res.json({ status: 'awake' }));
app.get('/status', (req, res) => res.json(db.accounts.getAllAsJSON()));

app.listen(PORT, (err) => {
  if (err) logger.error(err);
  logger.info('Server Listening...');
})
