const mongoose = require('mongoose');
const isEmpty = require('lodash.isempty');
let Comments = require('../models/comments');
let Articles = require('../models/articles')
let Users = require('../models/users');

function getAllComments(req, res, next) {
  return Comments.find()
    .lean()
    .populate('belongs_to', 'title -_id')
    .populate('created_by', 'username -_id')
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next)
}

function getCommentsById(req, res, next) {
  let id = req.params.comment_id;
  Comments.findById(id)
    .lean()
    .populate('belongs_to', 'title -_id')
    .populate('created_by', 'username -_id')
    .then(comment => {
      if (comment === null) {
        res.status(400).send({ message: 'Comment not found!' });
      }
      let singleCommentArr = [comment];
      let result = singleCommentArr.map(post => {
        post.belongs_to = post.belongs_to.title;
        post.created_by = post.created_by.username;
        return post;
      });
      res.status(200).send({ comment });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid comment ID!' });
      }
    });
}

function updateComments(req, res, next) {
  const { vote } = req.query;
  let comment_id = req.params.comment_id;
  let voteValue = 0;
  if (isEmpty(req.query)) {
    res.send({ message: 'Please Provide query' });
  }
  if (vote !== 'up' && vote !== 'down') {
    vote = 0;
  }
  voteValue = vote === 'up' ? 1 : -1
  Comments.findByIdAndUpdate({ _id: comment_id }, { $inc: { votes: voteValue } }, { new: true })
    .lean()
    .populate('created_by', 'username -_id')
    .populate('belongs_to', 'title -_id')
    .then(comment => {
      let commentArr = [comment];
      const result = commentArr.map(post => {
        post.belongs_to = post.belongs_to.title;
        post.created_by = post.created_by.username;
        return post;
      })
      res.status(200).send({ comment })
    })
    .catch(err => {
      if (err.name === 'CastError')
        res.status(400).send({ message: 'Invalid comment ID' })
    })
}



function deleteComment(req, res, next) {
  Comments.deleteOne({ _id: req.params.comment_id })
    .then(result => {
      if (result.n === 0) {
        res.status(400).send({ message: 'Comment not found!' });
      }
      res.status(200).send({ msg: 'Comment Deleted!' });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid comment ID.' });
      }
    })
}

module.exports = { getAllComments, getCommentsById, updateComments, deleteComment };