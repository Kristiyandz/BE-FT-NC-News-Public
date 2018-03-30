const mongoose = require('mongoose');
const faker = require('faker');
const Articles = require('../models/articles');
const Comments = require('../models/comments');
const users = require('../models/users');

function createCommentObj(comments) {
  return comments.reduce((obj, comment) => {
    obj[comment.belongs_to] = (obj[comment.belongs_to]) ? obj[comment.belongs_to] + 1 : 1;
    return obj;
  }, {})
}

function getArticles(req, res, next) {
  return Articles.find().lean()
    .then(articles => {
      return Promise.all([Comments.find(), articles]);
    })
    .then(([comments, articles]) => {
      return Promise.all([createCommentObj(comments), articles])
    })
    .then(([commentObj, articles]) => {
      return Promise.all([articles.map(article => {
        article['comment_count'] = commentObj[article._id] || 0;
        return article
      })])
    })
    .then(([articles]) => {
      res.send({ articles })
    })
    .catch(err => {
      next({ err: err, msg: 'articles not found' })
    })
}

function getCommentsByArticleId(req, res, next) {
  let id = req.params.article_id;
  Comments.find({ belongs_to: id })
    .then((comment) => {
      res.send(comment);
    })
    .catch(next)
}

function addComment(req, res, next) {
  users.findOne()
    .then(user => {
      return new Comments({
        body: req.body.comment,
        created_by: user._id,
        belongs_to: req.params.article_id
      }).save()
    })
    .then(comment => {
      res.status(201).json(comment)
    })
    .catch(next)
}


function updateArticleVote(req, res, next) {
  let articleId = req.params.article_id;
  if (req.query.vote === "up") {
    Articles.findByIdAndUpdate(articleId, { $inc: { votes: 1 } }, { new: true })
      .then(updatedArticle => {
        res.status(200).send(updatedArticle)
      })
      .catch(err => next({ status: 400, message: `Unable to up vote article with id ${articleId}`, error: err }))
  }
  if (req.query.vote === "down") {
    Articles.findByIdAndUpdate(articleId, { $inc: { votes: -1 } }, { new: true })
      .then(updatedArticle => {
        res.send(updatedArticle)
      })
      .catch(err => next({ status: 400, message: `Unable to up vote article with id ${articleId}`, error: err }))
  }
}

module.exports = { getArticles, getCommentsByArticleId, addComment, updateArticleVote };