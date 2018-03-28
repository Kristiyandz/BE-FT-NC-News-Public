process.env.NODE_ENV = 'test';
const faker = require('faker');
const sample = require('lodash.sample');
const mongoose = require('mongoose');
const { DB_URL } = require('../config/test').test;
const path = process.env.NODE_ENV;
mongoose.Promise = Promise;
const Articles = require('../models/articles');
const Topics = require('../models/topics');
const Comments = require('../models/comments');
const Users = require('../models/users');
//const testp = require('../seed/devData');
let topicsData = require('../seed/testData/topics.json')
let articlesData = require('../seed/testData/articles.json')
let usersData = require('../seed/testData/users.json')
const config = require('../config')[process.env.NODE_ENV]

function seedDB() {
  console.log('heloo');
  return mongoose.connection.dropDatabase()
    .then(() => {
      console.log('dropped')
      return Users.insertMany(usersData)
    })
    .then((users) => {
      console.log('users')
      return Promise.all([Topics.insertMany(topicsData), users])
    })
    .then(([topics, users]) => {
      console.log('topics users')
      const userIds = users.map(user => user._id)
      const topicIds = topics.map(topic => topic._id)
      articlesData.forEach(article => {
        article.created_by = sample(userIds);
        article.belongs_to = sample(topicIds);
      })
      return Promise.all([topics, users, Articles.insertMany(articlesData)])
    })
    .then(([topics, users, articles]) => {
      console.log('articles')
      let articleId = articles.map(article => article._id)
      let personId = users.map(user => user._id)
      let newComments = new Comments({
        body: faker.lorem.paragraph(),
        belongs_to: sample(articleId),
        created_at: parseInt(new Date().getTime()),
        votes: faker.random.number(),
        created_by: sample(personId)
      })
      return Promise.all([topics, users, articles, Comments.insertMany(newComments)])
    })
    .then(([topics, users, articles, comments]) => {
      console.log('end')
      return Promise.all([topics, users, articles, comments])
    })
    //.then(() => { mongoose.disconnect() })
    .catch(console.error)
}
//seedDB(DB_URL)

module.exports = seedDB;
