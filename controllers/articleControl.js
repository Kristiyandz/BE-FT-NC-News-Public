const mongoose = require('mongoose');
const faker = require('faker');
const Articles = require('../models/articles');
const Comments = require('../models/comments');
const Users = require('../models/users');

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
  let id = req.params.article_id;
  let reqBody = req.body
  let post = new Comments({
    body: reqBody.comment,
    belongs_to: id,
    created_at: parseInt(new Date().getTime()),
    votes: faker.random.number(),
    created_by: faker.name.findName()
  })
  post.save((err) => {
    if (err) throw err;
    res.send('Comment posted!');
  })
}

function updateVote(req, res, next) {
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

module.exports = { getArticles, getCommentsByArticleId, addComment, updateVote };