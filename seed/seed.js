let path;
if (process.env.NODE_ENV === 'production') path = 'dev'
else path = 'test';
const faker = require('faker');
const sample = require('lodash.sample');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Articles = require('../models/articles');
const Topics = require('../models/topics');
const Comments = require('../models/comments');
const Users = require('../models/users');
let topicsData = require(`../seed/${path}Data/topics.json`)
let articlesData = require(`../seed/${path}Data/articles.json`)
let usersData = require(`../seed/${path}Data/users.json`)


function seedDB() {
  return mongoose.connection.dropDatabase()
    .then(() => {
      return Users.insertMany(usersData)
    })
    .then((users) => {
      return Promise.all([Topics.insertMany(topicsData), users])
    })
    .then(([topics, users]) => {
      const userIds = users.map(user => user._id)
      const topicIds = topics.map(topic => topic._id)
      articlesData.forEach(article => {
        article.votes = faker.random.number();
        article.created_by = sample(userIds);
        article.belongs_to = sample(topicIds);
      })
      return Promise.all([topics, users, Articles.insertMany(articlesData)])
    })
    .then(([topics, users, articles]) => {
      let count = 200;
      let commentCount = 0;
      let articleId = articles.map(article => article._id)
      let personId = users.map(user => user._id)
      let manyComments = [];
      while (count > 0) {
        count--;
        let newComments = new Comments({
          body: faker.lorem.paragraph(),
          belongs_to: sample(articleId),
          created_at: parseInt(new Date().getTime()),
          votes: faker.random.number(),
          created_by: sample(personId)
        })
        manyComments.push(newComments);
      }
      return Promise.all([topics, users, articles, Comments.insertMany(manyComments)])
    })
    .then(([topics, users, articles, comments]) => {
      return Promise.all([topics, users, articles, comments])
    })

    .catch(console.error)
}


module.exports = seedDB;
