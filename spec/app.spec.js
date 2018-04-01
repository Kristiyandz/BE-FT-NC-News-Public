process.env.NODE_ENV = 'test';
const app = require('../app');
const mongoose = require('mongoose');
const request = require('supertest')(app);
const { expect } = require('chai');
const { DB_URL } = require('../config/test');
const seedDB = require('../seed/seed');
const Comments = require('../models/comments');

const topic = require('../models/topics');
const articles = require('../models/topics');
const topics = require('../models/topics');

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
          expect(result.body).to.be.an('object');
          expect(result.body.topics).to.be.an('array');
          expect(result.body.topics[0].slug).to.eql('mitch');
        })
    })
  })
  describe('GET /api/topics/:topic_id', () => {
    it('gets all the articles for a certain topic', () => {
      return request
        .get(`/api/topics/${topics[0].slug}/articles`)
        .expect(200)
        .then(result => {
          expect(result.body).to.be.an('object');
          expect(result.body.articles).to.be.an('array');
          expect(result.body.articles[0].belongs_to.title).to.eql('Mitch')
        })
    })
    it('return error message when the topic ID is not valid', () => {
      return request
        .get('/api/topics/1234')
        .expect(404)
        .then(result => {
          expect(result.status).to.eql(404);
          expect(result.text).to.be.a('string');
        })
    })
  })
  describe('GET /api/articles', () => {
    it('gets all articles', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(result => {
          expect(result.body).to.be.an('object');
          expect(result.body.articles).to.be.an('array');
          expect(result.body.articles.length).to.eql(4);
        })
    })
    it('return error message when something else is passed after/api/', () => {
      return request
        .get('/api/abc123')
        .expect(404)
        .then(result => {
          expect(result.status).to.eql(404)
          expect(result.text).to.eql('{"message":"Page not found!"}')
        })
    })
  });
  describe('GET /api/articles/:article_id/comments', () => {
    it('get all comments for individual article', () => {
      return request
        .get(`/api/articles/${articles[0]._id}/comments`)
        .expect(200)
        .then(result => {
          expect(result.body).to.be.an('object');
          expect(result.body.comments).to.be.an('array');
          expect(result.body.comments[0]).to.have.property('body');
          expect(result.body.comments[0].belongs_to).to.be.an('string');
        })
    })
    it("returns an error message for incorrecti ID", () => {
      return request
        .get(`/api/articles/123abc/comments`)
        .expect(400)
        .then(result => {
          expect(result.status).to.eql(400);
          expect(result.text).to.eql('{"message":"Invalid article ID, failed to fetch comments."}');
        });
    });
  })
  describe('POST /api/articles/:article_id/comments', () => {
    it('post a comment', () => {
      return request
        .post(`/api/articles/${articles[0]._id}/comments?user=Butter_Bridge`)
        .send({ "comment": "new test comment", "belongs_to": users._id })
        .expect(201)
        .then(result => {
          expect(result.body).to.be.an('object');
          expect(result.body.body).to.eql('new test comment');
        })
    })
    it("returns an error message when posting a comment for invalid article id or missing query", () => {
      return request
        .post(`/api/articles/123banana/comments?username=Butter_Bridge`)
        .send({ comment: "Hellow World" })
        .expect(400)
        .then(result => {
          expect(result.status).to.eql(400)
          expect(result.text).to.eql('{"message":"Either article ID is invalid or the query is not complet. For complete query please provide ?user=username."}');
        });
    });
  })
  describe('PUT /api/articles/:article_id', () => {
    it('increments article vote by 1', () => {
      let votes = articles[0].votes;
      // console.log(votes);
      return request
        .put(`/api/articles/${articles[0]._id}?vote=up`)
        .expect(200)
        .then(result => {
          expect(result.body).to.be.an('object');
          expect(votes).to.eql(articles[0].votes)
        })
    })
    it('decrements article vote by 1', () => {
      let votes = articles[0].votes;
      // console.log(votes);
      return request
        .put(`/api/articles/${articles[0]._id}?vote=down`)
        .expect(200)
        .then(result => {
          expect(result.body).to.be.an('object');
          expect(votes).to.eql(articles[0].votes)
        })
    })
  })
  describe('PUT /api/comments/:comment_id', () => {
    it('increments comment vote by 1', () => {
      let votes = comments[0].votes;
      // console.log(votes);
      return request
        .put(`/api/comments/${comments[0]._id}?vote=up`)
        .expect(200)
        .then(result => {
          expect(result.body).to.be.an('object');
          expect(votes).to.eql(comments[0].votes)
        })
    })
    it('decrements a comment vote by 1', () => {
      let votes = comments[0].votes;
      // console.log(votes);
      return request
        .put(`/api/comments/${comments[0]._id}?vote=down`)
        .expect(200)
        .then(result => {
          expect(result.body).to.be.an('object');
          expect(votes).to.eql(comments[0].votes)
        })
    })

  })
  describe('GET /api/comments', () => {
    it('get all comments', () => {
      return request
        .get('/api/comments')
        .expect(200)
        .then(result => {
          expect(result.body).to.be.an('object');
          expect(result.body.comments).to.be.an('array');
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
