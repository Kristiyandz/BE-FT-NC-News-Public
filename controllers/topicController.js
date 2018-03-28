const mongoose = require('mongoose');
const Topics = require('../models/topics');

function getTopics(req, res, next) {
  console.log('controller');
  Topics.find((err, topics) => {
    res.status(200).send(topics)
  })
}

function getTopicsById(req, res, next) {
  let id = req.params.topic_id;
  Topics.findById(id)
    .then((topic) => {
      res.send(topic);
    })
}

module.exports = { getTopics, getTopicsById };