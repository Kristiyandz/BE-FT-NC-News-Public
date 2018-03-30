const mongoose = require('mongoose');
const Topics = require('../models/topics');
const Articles = require('../models/articles');
const Comments = require('../models/comments');

function getTopics(req, res, next) {
  Topics.find((err, topics) => {
    res.status(200).send({ topics })
  })
}

function getTopicsById(req, res, next) {
  let id = req.params.topic_id;
  Topics.findById(id)
    .then((topic) => {
      res.send({ topic });
    })
    .catch(next)
}

function createCommentObj(comments) {
  return comments.reduce((obj, comment) => {
    obj[comment.belongs_to] = (obj[comment.belongs_to]) ? obj[comment.belongs_to] + 1 : 1;
    return obj;
  }, {})
}

function getArticlesByTopicId(req, res, next) {
  let topic = req.params.topic_id
  return Articles.find({ belongs_to: topic }).lean()
    .then(recievedArticles => {
      return Promise.all([Comments.find(), recievedArticles]);
    })
    .then(([comments, articles]) => {
      return Promise.all([createCommentObj(comments), articles])
    })
    .then(([commentObj, articles]) => {
      console.log(commentObj);
      return Promise.all([articles.map(article => {
        article['comment_count'] = commentObj[article._id] || 0;
        return article
      })])
    })
    .then(([articles]) => {
      res.send({ articles })
    })
    .catch(next)
}

module.exports = { getTopics, getArticlesByTopicId, getTopicsById };