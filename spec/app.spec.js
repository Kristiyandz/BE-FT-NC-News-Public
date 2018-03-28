process.env.NODE_ENV = 'test';
const app = require('../app');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const request = require('supertest')(app);
const { expect } = require('chai');
const seedDB = require('../seed/test.seed');
const { DB_URL } = require('../config/test').test;
const Topic = require('../models/topics');

describe('/api', () => {
  let topics, users, articles, comments;


  beforeEach(() => {
    this.timeout = 10000

    return seedDB()
      .then((data) => {
        console.log(data[0]);
        [topics, users, articles, comments] = data;


      })
  })
  after(() => {
    // return mongoose.disconnect();
  })

  describe('test', () => {
    it('gets all the topics', () => {
      return request
        .get('api/topics')
        .expect(200)
        .then(result => {
          console.log(result);
        })

    })
  })
});