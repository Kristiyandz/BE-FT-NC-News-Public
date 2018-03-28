if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';
const app = require('express')();
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const apiRouter = require('./router/apiRouter');
const bodyParser = require('body-parser');
const { DB_URL } = require('./config')[process.env.NODE_ENV];
console.log(DB_URL, '****')
mongoose.connect(DB_URL)
  .then(() => {
    console.log(`connected to DB ${DB_URL}`);
  })
app.use(bodyParser.json());
app.use('/api', apiRouter);

module.exports = app;