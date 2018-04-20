if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const app = require('express')();
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const apiRouter = require('./router/apiRouter');
const bodyParser = require('body-parser');
const DB_URL = process.env.DB_URL || require('./config').DB_URL;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect(DB_URL)
  .then(() => {
    console.log(`connected to DB ${DB_URL}`);
  });
app.use(bodyParser.json());
app.get('/', (req, res, next) => {
  res.sendFile('views/index.html', { root: `${process.cwd()}` });
});
app.use('/api', apiRouter);

app.use('/*', (req, res, next) => next({ status: 404 }));
app.use((err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ message: 'Page not found!' });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 500) res.status(500).send({ err });
});


module.exports = app;