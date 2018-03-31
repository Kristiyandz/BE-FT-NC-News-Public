const Users = require('../models/users');

// function getUsers(req, res, next) {
//   Users.find()
//     .then((users) => {
//       res.status(200).send({ users });
//     })
// }
function getUserById(req, res, next) {
  const user_id = req.params.user_id
  Users.findOne({ username: user_id })
    .then(user => {
      res.status(200).send({ user })
    })

}

// function getUserById(req, res, next) {
//   let id = req.params.user_id;
//   Users.findById(id)
//     .then((user) => {
//       res.status(200).send({ user })
//     })
// }

module.exports = { getUserById };