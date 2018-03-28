process.env.NODE_ENV = 'dev';
const uniqueRandomArray = require('unique-random-array');
const faker = require('faker');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const DB_URL = require('../config/config');
const path = process.env.NODE_ENV;

const Articles = require('../models/articles');
const Topics = require('../models/topics');
const Comments = require('../models/comments');
const Users = require('../models/users');
//const testp = require('../seed/devData');
let topicsData = require('../seed/devData/topics.json')
let articlesData = require('../seed/devData/articles.json')
let usersData = require('../seed/devData/users.json')
const config = require('../config/config')[process.env.NODE_ENV]

function seedDB(DB_URL) {
  let userId = {};
  let randomUserIds = [];
  let articles = null;
  let topicsIds = {};
  let comments = [];
  let articleIds = [];
  // mongoose.connect(config.DB_URL).then(() => {
  //console.log(`connected to ${DB_URL}`);
  return mongoose.connection.dropDatabase()
    //})
    .then(() => {
      console.log('Database dropped');
      return Users.insertMany(usersData)
    })
    .then((users) => {
      return users.map(user => {
        let key = user.name;
        let val = user._id;
        return userId[key] = val;
      })
    })
    .then((savedUsers) => {
      let random = uniqueRandomArray(savedUsers)
      return random
    })
    .then((randomFunc) => {
      function getTopicIds(data) {
        Topics.insertMany(topicsData)
      }
      articlesData.map(article => {
        article.created_by = randomFunc();
      })
    })
    .then(() => {
      articles = articlesData
      return Topics.insertMany(topicsData)
    })
    .then((topicResult) => {
      return topicResult.map(topic => {
        let key = topic.slug;
        let val = topic._id;
        return topicsIds[key] = val;
      })
    })
    .then((articlesResult) => {
      articles.forEach(arcl => {
        arcl.votes = faker.random.number();
        arcl.belongs_to = null;
        for (let key in topicsIds) {
          if (arcl.topic === key) {
            arcl.belongs_to = topicsIds[key]
          }
        }
      })
      return articles;

    })
    .then((finalArticles) => {
      return Articles.insertMany(finalArticles)
    })
    .then((recievedArticles) => {
      recievedArticles.map(papers => {
        for (let key in papers) {
          if (key === '_id') {
            articleIds.push(papers[key]);
          }
        }
      })
      return articleIds;
    })
    .then((artIds) => {
      let count = 200;
      let ids = Object.values(userId)
      let randomArticleID = uniqueRandomArray(artIds);
      let randomPersonID = uniqueRandomArray(ids);
      console.log(randomArticleID());
      while (count > 0) {
        count--;
        let newComments = new Comments({
          body: faker.lorem.paragraph(),
          belongs_to: randomArticleID(),
          created_at: parseInt(new Date().getTime()),
          votes: faker.random.number(),
          created_by: randomPersonID()
        })
        comments.push(newComments);
      }
      return Comments.insertMany(comments);
    })
    .then(() => { mongoose.disconnect() })
    .catch(console.error)
}
seedDB(DB_URL)
module.exports = seedDB;

/*
--dev.seed.js---
  const mongoose = require(mongoose);
  mongoose.promise = Promise;
  const {DB} require(config)
  const seedDB = require('./seed);
  

  mongoose.connect(DB)
  .then(()=> seedDB())
  .then(console.log)
  .then(()=> mongoose.disconnect)
  .catch(console.log)

  create seed script
  "seed:dev" "node seed/dev.seed.js"

  testing
  process.env.NODE_ENV = 'test'
  const app = require('../ap);
  const mongoose = require('mongoose);
  mongoose.Promise = Promise;
  const request = require('supertest)(app)
  const {expect} = require('chai');
  const seedDB = require('../seed/seed)
  const {Topics} = require('../models');


  decribe('/api',()=>{
    let topics, users;
    beforeEach(()=>{
      return seedDB()
        .then(data =>{
          [topics, users] = data;
        })
    })
    after(()=>{
      return mongoose.disconnect();
    })
    it('seeds the topics',()=>{
      return Topics.count()
        .then(val => {
          expect(val).to.equal(2)
        })
    })
    it('holds on the data', ()=>{
      expect(topics[0].title).to.equal('Mitch');
    })
  })
*/


