const mongoose = require('mongoose');
const isEmpty = require('lodash.isempty');
let Comments = require('../models/comments');
let Articles = require('../models/articles')
let Users = require('../models/users');
//const Users = require('../models/users');

function getAllComments(req, res, next) {
  return Comments.find()
    .populate('belongs_to', 'title -_id')
    .populate('created_by', 'username -_id')
    .then(comments => {
      // let commentsArray = comments.map(comment => {
      //   console.log(comment);
      //   comment.belongs_to = comment.belongs_to.title;
      //   comment.created_by = comment.created_by.username;
      //   return comment;
      // })
      // console.log(commentsArray);
      res.status(200).send({ comments })
    })

    .catch(next)
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
    .populate('created_by', 'username -_id')
    .populate('belongs_to', 'title -_id')
    .then(comment => {
      res.status(200).send(comment)
    })
    .catch(err => {
      console.log(err);
      if (err.name === 'CastError')
        res.send({ message: 'Invalid comment ID' })
    })
}



function deleteComment(req, res, next) {
  let id = req.params.comment_id;
  Comments.findByIdAndRemove(id)
    .then(() => {
      res.status(202).send({ comment_id: id, status: 'deleted' })
    })
    .catch(next)

}

module.exports = { getAllComments, updateComments, deleteComment };