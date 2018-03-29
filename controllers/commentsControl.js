const mongoose = require('mongoose');
let Comments = require('../models/comments');
//const Users = require('../models/users');

function updateComments(req, res, next) {
  let id = req.params.comment_id;
  console.log(id);
  let query = req.query;
  console.log(id);
  console.log(query);
  Comments.findById(id)
    .then((comment) => {
      if (query.vote === 'down') {
        comment.votes -= 1;
        res.send(comment);
      } else if (query.vote === 'up') {
        comment.votes += 1;
        res.send(comment);
      }
      comment.save();
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  let id = req.params.comment_id;
  Comments.findByIdAndRemove(id)
    .then(() => {
      res.status(202).send({ comment_id: id, status: 'deleted' })
    })
    .catch(next)

}

module.exports = { updateComments, deleteComment };