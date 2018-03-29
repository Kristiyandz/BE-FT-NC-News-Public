const mongoose = require('mongoose');
const faker = require('faker');
const Articles = require('../models/articles');
const Comments = require('../models/comments');
const users = require('../models/users');

function getArticles(req, res, next) {
  Articles.find()
    .then((articles) => {
      res.send(articles);
    })
}

function getCommentsByArticleId(req, res, next) {
  let id = req.params.article_id;
  Comments.find({ belongs_to: id })
    .then((comment) => {
      res.send(comment);
    })
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
}


function updateArticleVote(req, res, next) {
  let id = req.params.article_id;
  let query = req.query;
  Articles.findById(id)
    .then((article) => {
      if (query.vote === 'down') {
        console.log(article.votes);
        article.votes -= 1;
        res.send(article);
      } else if (query.vote === 'up') {
        article.votes += 1;
        console.log(article.votes);
        res.send(article);
      }
      article.save()
    })
}

module.exports = { getArticles, getCommentsByArticleId, addComment, updateArticleVote };