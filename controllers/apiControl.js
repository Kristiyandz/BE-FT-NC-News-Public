const mongoose = require('mongoose');
//const DB_URL = require('../config/config');

function getStatus(req, res, next) {
  res.status(200).send({ status: 'OK' })
}
module.exports = { getStatus }