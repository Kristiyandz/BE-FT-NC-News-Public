process.env.NODE_ENV = "test";
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const { DB_URL } = require('../config/test');
const seedDB = require('./seed');

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`connected to ${DB_URL}`);
    return seedDB(DB_URL);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.log(err);
    mongoose.disconnect();
  });
