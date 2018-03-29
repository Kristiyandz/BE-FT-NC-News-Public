let path;
if (process.env.NODE_ENV === 'production') path = 'dev'
else path = 'test';
//process.env.NODE_ENV = 'test';
const faker = require('faker');
const sample = require('lodash.sample');
const mongoose = require('mongoose');
//const { DB_URL } = require('../config/');
//const path = process.env.NODE_ENV;
mongoose.Promise = Promise;
const Articles = require('../models/articles');
const Topics = require('../models/topics');
const Comments = require('../models/comments');
const Users = require('../models/users');
//const testp = require('../seed/devData');
let topicsData = require(`../seed/${path}Data/topics.json`)
let articlesData = require(`../seed/${path}Data/articles.json`)
let usersData = require(`../seed/${path}Data/users.json`)
//const config = require('../config')[process.env.NODE_ENV]


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
        article.votes: faker.random.number();
        article.created_by = sample(userIds);
        article.belongs_to = sample(topicIds);
      })
      return Promise.all([topics, users, Articles.insertMany(articlesData)])
    })
    .then(([topics, users, articles]) => {
      let count = 15;
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
    //.then(() => { mongoose.disconnect() })
    .catch(console.error)
}
//seedDB(DB_URL)

module.exports = seedDB;
// process.env.NODE_ENV = 'dev';
// const uniqueRandomArray = require('unique-random-array');
// const faker = require('faker');
// const mongoose = require('mongoose');
// mongoose.Promise = Promise;
// const DB_URL = require('../config/config');
// const path = process.env.NODE_ENV;

// const Articles = require('../models/articles');
// const Topics = require('../models/topics');
// const Comments = require('../models/comments');
// const Users = require('../models/users');
// //const testp = require('../seed/devData');
// let topicsData = require('../seed/devData/topics.json')
// let articlesData = require('../seed/devData/articles.json')
// let usersData = require('../seed/devData/users.json')
// const config = require('../config/config')[process.env.NODE_ENV]

// function seedDB(DB_URL) {
//   let userId = {};
//   let randomUserIds = [];
//   let articles = null;
//   let topicsIds = {};
//   let comments = [];
//   let articleIds = [];
//   // mongoose.connect(config.DB_URL).then(() => {
//   //console.log(`connected to ${DB_URL}`);
//   return mongoose.connection.dropDatabase()
//     //})
//     .then(() => {
//       console.log('Database dropped');
//       return Users.insertMany(usersData)
//     })
//     .then((users) => {
//       return users.map(user => {
//         let key = user.name;
//         let val = user._id;
//         return userId[key] = val;
//       })
//     })
//     .then((savedUsers) => {
//       let random = uniqueRandomArray(savedUsers)
//       return random
//     })
//     .then((randomFunc) => {
//       function getTopicIds(data) {
//         Topics.insertMany(topicsData)
//       }
//       articlesData.map(article => {
//         article.created_by = randomFunc();
//       })
//     })
//     .then(() => {
//       articles = articlesData
//       return Topics.insertMany(topicsData)
//     })
//     .then((topicResult) => {
//       return topicResult.map(topic => {
//         let key = topic.slug;
//         let val = topic._id;
//         return topicsIds[key] = val;
//       })
//     })
//     .then((articlesResult) => {
//       articles.forEach(arcl => {
//         arcl.votes = faker.random.number();
//         arcl.belongs_to = null;
//         for (let key in topicsIds) {
//           if (arcl.topic === key) {
//             arcl.belongs_to = topicsIds[key]
//           }
//         }
//       })
//       return articles;

//     })
//     .then((finalArticles) => {
//       return Articles.insertMany(finalArticles)
//     })
//     .then((recievedArticles) => {
//       recievedArticles.map(papers => {
//         for (let key in papers) {
//           if (key === '_id') {
//             articleIds.push(papers[key]);
//           }
//         }
//       })
//       return articleIds;
//     })
//     .then((artIds) => {
//       let count = 200;
//       let ids = Object.values(userId)
//       let randomArticleID = uniqueRandomArray(artIds);
//       let randomPersonID = uniqueRandomArray(ids);
//       console.log(randomArticleID());
//       while (count > 0) {
//         count--;
//         let newComments = new Comments({
//           body: faker.lorem.paragraph(),
//           belongs_to: randomArticleID(),
//           created_at: parseInt(new Date().getTime()),
//           votes: faker.random.number(),
//           created_by: randomPersonID()
//         })
//         comments.push(newComments);
//       }
//       return Comments.insertMany(comments);
//     })
//     .then(() => { mongoose.disconnect() })
//     .catch(console.error)
// }
// seedDB(DB_URL)
// module.exports = seedDB;

// /*
// --dev.seed.js---
//   const mongoose = require(mongoose);
//   mongoose.promise = Promise;
//   const {DB} require(config)
//   const seedDB = require('./seed);


//   mongoose.connect(DB)
//   .then(()=> seedDB())
//   .then(console.log)
//   .then(()=> mongoose.disconnect)
//   .catch(console.log)

//   create seed script
//   "seed:dev" "node seed/dev.seed.js"

//   testing
//   process.env.NODE_ENV = 'test'
//   const app = require('../ap);
//   const mongoose = require('mongoose);
//   mongoose.Promise = Promise;
//   const request = require('supertest)(app)
//   const {expect} = require('chai');
//   const seedDB = require('../seed/seed)
//   const {Topics} = require('../models');


//   decribe('/api',()=>{
//     let topics, users;
//     beforeEach(()=>{
//       return seedDB()
//         .then(data =>{
//           [topics, users] = data;
//         })
//     })
//     after(()=>{
//       return mongoose.disconnect();
//     })
//     it('seeds the topics',()=>{
//       return Topics.count()
//         .then(val => {
//           expect(val).to.equal(2)
//         })
//     })
//     it('holds on the data', ()=>{
//       expect(topics[0].title).to.equal('Mitch');
//     })
//   })
// */


