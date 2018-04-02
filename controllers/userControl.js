const Users = require('../models/users');

function getUsers(req, res, next) {
  Users.find()
    .then((users) => {
      res.status(200).send({ users });
    })
}

function getUserByUsername(req, res, next) {
  const user_name = req.params.username;
  Users.find()
    .then(user => {
      let arrayOfUsers = [user];
      let result = arrayOfUsers[0].map(user => {
        if (user.username === user_name) {
          res.status(200).send({ user });
        }
      });
      res.status(400).send({ message: 'Invalud username!' });
    })
    .catch(next)
}

module.exports = { getUsers, getUserByUsername };