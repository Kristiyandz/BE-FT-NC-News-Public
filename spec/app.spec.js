process.env.NODE_ENV = 'test';
//const faker = require('faker');
const app = require('../app');
const mongoose = require('mongoose');
//mongoose.Promise = Promise;
const request = require('supertest')(app);
const { expect } = require('chai');
const { DB_URL } = require('../config/test');
const seedDB = require('../seed/seed');
const Comments = require('../models/comments');

// const Topic = require('../models/topics');
// const Article = require('../models/topics');
// const Topic = require('../models/topics');

describe('/api', () => {
  let topics, users, articles, comments;
  beforeEach(function () {
    this.timeout(10000);
    return seedDB().then(data => {
      [topics, users, articles, comments] = data;
    });
  });
  after(() => {
    return mongoose.disconnect();
  })
  describe('GET api/topics', () => {
    it('gets all the topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(result => {
          expect(result.body.topics[0].slug).to.equal('mitch');
        })

    })
  })
  describe('GET /api/topics/:topic_id', () => {
    it('gets all the articles for a certain topic', () => {
      return request
        .get(`/api/topics/${topics[0]._id}`)
        .expect(200)
        .then(result => {
          expect(result.body.topic.slug).to.eql('mitch');
        })
    })
  })
  describe('GET /api/articles', () => {
    it('gets all articles', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(result => {
          expect(result.body.length).to.eql(4);
        })
    })
  });
  describe('GET /api/articles/:article_id/comments', () => {
    it('get all comments for individual article', () => {
      return request
        .get(`/api/articles/${articles[0]._id}/comments`)
        .expect(200)
        .then(result => {
          expect(result.body.length).to.be.greaterThan(0)
        })
    })
  })
  describe('POST /api/articles/:article_id/comments', () => {
    it('get all comments for individual article', () => {
      return request
        .post(`/api/articles/${articles[0]._id}/comments`)
        .send({ 'comment': 'I like bananas!' })
        .expect(201)
        .then(result => {
          expect(result.body.body).to.eql('I like bananas!');
        })
    })
  })
  describe('/api/comments/:comment_id', () => {
    it('delete a comment by ID', () => {
      let length = comments.length - 1;
      return request
        .delete(`/api/comments/${comments[0]._id}`)
        .expect(202)
        .then(() => {
          expect(length).to.eql(comments.length - 1);
        })
    })
  });


});
