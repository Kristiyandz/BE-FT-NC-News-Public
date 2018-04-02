const Topics = require('../models/topics');
const Articles = require('../models/articles');
const Comments = require('../models/comments');

function getTopics(req, res, next) {
  Topics.find()
    .lean()
    .then(topics => {
      res.status(200).send({ topics })
    })
    .catch(next);
};

function getArticlesByTopicId(req, res, next) {
  let id = req.params.topic_id;
  return Topics.findOne({ slug: id })
    .then(topic => {
      return Articles.find({ belongs_to: topic._id })
        .lean()
        .populate("belongs_to", "title -_id")
        .populate("created_by", "username -_id")
        .then(articles => {
          let arrOfArticles = [articles]
          let result = arrOfArticles[0].map(post => {
            post.created_by = post.created_by.username;
            post.belongs_to = post.belongs_to.title;
            return post;
          });
          res.status(200).send({ articles })
        })
    })
    .catch(next);
};

module.exports = { getTopics, getArticlesByTopicId };