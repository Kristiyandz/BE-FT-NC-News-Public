const Articles = require('../models/articles');
const Comments = require('../models/comments');
const Users = require('../models/users');

function getArticleById(req, res, next) {
  let id = req.params.article_id;
  Articles.findById(id)
    .lean()
    .populate('created_by', 'username -_id')
    .populate('belongs_to', 'title -_id')
    .then(article => {
      if (!article) {
        let error_msg = new Error('Article not found, enter valid article id!')
        error_msg.name = 'Error';
        throw error;
      }
      let articleArray = [article];
      let result = articleArray.map(post => {
        post.created_by = post.created_by.username;
        post.belongs_to = post.belongs_to.title;
        return post;
      })
      res.status(200).json({ result })
    })
    .catch(err => {
      if (err.name === 'Error') {
        return next({ code: 1, msg: err.message })
      }
      if (err.name === 'CastError') {
        return next({ code: 1, msg: 'Invalid article ID' })
      }
      next(err)
    })
}


function getArticles(req, res, next) {
  return Articles.find()
    .populate("belongs_to", "title -_id")
    .populate("created_by", "username -_id")
    .then(articles => {
      const promises = articles.map(article => {
        return Comments.find({ belongs_to: article._id }).count();
      });
      return Promise.all([articles, ...promises]);
    })
    .then(([articles, ...counts]) => {
      return articles.map((article) => {
        return {
          title: article.title,
          body: article.body,
          topic: article.belongs_to.title,
          created_by: article.created_by.username,
          votes: article.votes,
          comments: counts[0],
          _id: article._id
        };
      });
    })
    .then(articles => res.send({ articles }))
    .catch(next);
}

function getCommentsByArticleId(req, res, next) {
  let id = req.params.article_id;
  return Comments.find({ belongs_to: id }).lean()
    .populate('belongs_to', 'title -_id ')
    .populate('created_by', 'username -_id')
    .then(comments => {
      let result = comments.map(comment => {
        comment.belongs_to = comment.belongs_to.title;
        comment.created_by = comment.created_by.username;
        return comment;
      })
      res.status(200).send({ comments })
    })
}

function postComment(req, res, next) {
  let user_name = req.query.user;
  let article_id = req.params.article_id;
  let comment_body = req.body;
  Users.find({ username: req.query.user })
    .then(user => {
      let userID = user[0]._id;
      return newComment = new Comments({
        body: req.body.comment,
        created_by: userID,
        belongs_to: req.params.article_id
      }).save()
    })
    .then(result => {
      res.status(201).send(result)
    })
}




function updateArticleVote(req, res, next) {
  const { vote } = req.query;
  let article_id = req.params.article_id;
  console.log(article_id);
  let voteValue = 0;
  if (vote !== 'up' && vote !== 'down') {
    vote = 0;
  }
  voteValue = vote === 'up' ? 1 : -1
  console.log(voteValue);
  Articles.findByIdAndUpdate({ _id: article_id }, { $inc: { votes: voteValue } }, { new: true })
    .then(article => {
      res.status(200).send(article)
    })
    .catch(next)
}

module.exports = { getArticleById, getArticles, getCommentsByArticleId, updateArticleVote, postComment };