process.env.NODE_ENV = 'test';
const app = require('../app');
const mongoose = require('mongoose');
const request = require('supertest')(app);
const { expect } = require('chai');
const seedDB = require('../seed/seed');

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
  });
  describe('GET / returns an HTML page with all of the endpoints', () => {
    it('displays an HTML page in the browser', () => {
      return request
        .get('/')
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.text).to.be.a('string');
          expect(result.type).to.eql('text/html');
        });
    });
  });
  describe('GET api/topics', () => {
    it('gets all the topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(result.body.topics).to.be.an('array');
          expect(result.body.topics[0].slug).to.eql('mitch');
        });
    });
  });
  describe('GET /api/topics/:topic_id', () => {
    it('gets all the articles for a certain topic', () => {
      return request
        .get(`/api/topics/${topics[0].slug}/articles`)
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(result.body.articles).to.be.an('array');
          expect(result.body.articles[0].belongs_to).to.eql('Mitch')
        });
    });
    it('return error message when the topic ID is not valid', () => {
      return request
        .get('/api/topics/1234')
        .expect(404)
        .then(result => {
          expect(result.status).to.eql(404)
          expect(result.text).to.be.a('string');
        });
    });
  });
  describe('GET /api/articles', () => {
    it('gets all articles', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(result.body.articles).to.be.an('array');
          expect(result.body.articles.length).to.eql(4);
        });
    });
    it('returns error message for incorrect path after /api', () => {
      return request
        .get('/api/abc123')
        .expect(404)
        .then(result => {
          expect(result.status).to.eql(404)
          expect(result.text).to.eql('{"message":"Page not found!"}')
        });
    });
  });
  describe('GET /api/articles/article_id', () => {
    it('gets an article by ID', () => {
      return request
        .get(`/api/articles/${articles[0]._id}`)
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(result.body.result[0].belongs_to).to.be.a('string');
          expect(result.body.result[0].created_by).to.be.a('string');
        });
    });
    it('returns error message for invalid article ID', () => {
      return request
        .get(`/api/articles/blah`)
        .expect(400)
        .then(result => {
          expect(result.status).to.eql(400);
          expect(result.body).to.be.an('object');
          expect(result.text).to.eql('{"message":"Invalid article ID!"}');
        });
    });
  });
  describe('GET /api/articles/:article_id/comments', () => {
    it('gets all comments for individual article', () => {
      return request
        .get(`/api/articles/${articles[0]._id}/comments`)
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(result.body.comments).to.be.an('array');
          expect(result.body.comments[0]).to.have.property('body');
          expect(result.body.comments[0].belongs_to).to.be.a('string');
        });
    });
    it("returns an error message for incorrect article ID", () => {
      return request
        .get(`/api/articles/123abc/comments`)
        .expect(400)
        .then(result => {
          expect(result.status).to.eql(400);
          expect(result.text).to.eql('{"message":"Invalid article ID, failed to fetch comments."}');
        });
    });
  });
  describe('POST /api/articles/:article_id/comments', () => {
    it('post a comment', () => {
      return request
        .post(`/api/articles/${articles[0]._id}/comments?user=Butter_Bridge`)
        .send({ "comment": "new test comment", "belongs_to": users._id })
        .expect(201)
        .then(result => {
          expect(result.status).to.eql(201);
          expect(result.body).to.be.an('object');
          expect(result.body.body).to.eql('new test comment');
        });
    });
    it("returns an error message when posting a comment for invalid article ID or missing query", () => {
      return request
        .post(`/api/articles/123banana/comments?username=Butter_Bridge`)
        .send({ comment: "Hellow World" })
        .expect(400)
        .then(result => {
          expect(result.status).to.eql(400)
          expect(result.text).to.eql('{"message":"Invalid article ID or missing query."}');
        });
    });
  });
  describe('PUT /api/articles/:article_id', () => {
    it('increments article vote by 1', () => {
      let votes = articles[0].votes;
      // console.log(votes);
      return request
        .put(`/api/articles/${articles[0]._id}?vote=up`)
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(votes).to.eql(articles[0].votes)
        });
    });
    it('decrements article vote by 1', () => {
      let votes = articles[0].votes;
      // console.log(votes);
      return request
        .put(`/api/articles/${articles[0]._id}?vote=down`)
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(votes).to.eql(articles[0].votes)
        });
    });
    it('sends error message for invalid article ID', () => {
      return request
        .put(`/api/articles/1234bananasabc?vote=down`)
        .expect(400)
        .then(result => {
          expect(result.status).to.eql(400);
          expect(result.body).to.be.an('object');
          expect(result.text).to.eql('{"message":"Invalid article ID"}')
        });
    });
  });
  describe('GET /api/comments', () => {
    it('gets all comments', () => {
      return request
        .get('/api/comments')
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(result.body.comments).to.be.an('array');
        });
    });
  });
  describe('GET /api/comments/comment_id', () => {
    it('gets all comments by ID', () => {
      return request
        .get(`/api/comments/${comments[0]._id}`)
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(result.body.comment.belongs_to).to.be.a('string');
          expect(result.body.comment.created_by).to.be.a('string');
        });
    });
    it('returns error message for invalid comment ID', () => {
      return request
        .get(`/api/comments/blah`)
        .expect(400)
        .then(result => {
          expect(result.status).to.eql(400);
          expect(result.body).to.be.an('object');
          expect(result.text).to.eql('{"message":"Invalid comment ID!"}');
        });
    });
  });
  describe('PUT /api/comments/:comment_id', () => {
    it('increments comment vote by 1', () => {
      let votes = comments[0].votes;
      // console.log(votes);
      return request
        .put(`/api/comments/${comments[0]._id}?vote=up`)
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(votes).to.eql(comments[0].votes)
        });
    });
    it('decrements a comment vote by 1', () => {
      let votes = comments[0].votes;
      // console.log(votes);
      return request
        .put(`/api/comments/${comments[0]._id}?vote=down`)
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(votes).to.eql(comments[0].votes)
        });
    });
    it('send error message for invalid comment ID', () => {
      return request
        .put(`/api/comments/1234bananasabc?vote=down`)
        .expect(400)
        .then(result => {
          expect(result.status).to.eql(400);
          expect(result.body).to.be.an('object');
          expect(result.text).to.eql('{"message":"Invalid comment ID"}')
        });
    });
  });
  describe('DELETE /api/comments/:comment_id', () => {
    it('deletes a comment by ID', () => {
      return request
        .delete(`/api/comments/${comments[0]._id}`)
        .expect(200)
        .then((result) => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(result.text).to.eql('{"msg":"Comment Deleted!"}')
        });
    });
    it('returns error when passed invalid comment ID', () => {
      return request
        .delete(`/api/comments/12345`)
        .expect(400)
        .then((result) => {
          expect(result.status).to.eql(400);
          expect(result.body).to.be.an('object');
          expect(result.text).to.eql('{"message":"Invalid comment ID."}')
        });
    });
  });
  describe('GET /api/users', () => {
    it('gets all users', () => {
      return request
        .get('/api/users')
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(result.body.users).to.be.an('array');
        });
    });
  });
  describe('GET /api/users/username', () => {
    it('gets user by username', () => {
      return request
        .get(`/api/users/butter_bridge`)
        .expect(200)
        .then(result => {
          expect(result.status).to.eql(200);
          expect(result.body).to.be.an('object');
          expect(result.body.user.username).to.eql('butter_bridge');
          expect(result.body.user.name).to.eql('jonny');
        });
    });
    it('return error message when incorrect username is passed', () => {
      return request
        .get('/api/users/gandalf')
        .expect(400)
        .then(result => {
          expect(result.status).to.eql(400);
          expect(result.body).to.be.an('object');
          expect(result.text).to.eql('{"message":"Invalud username!"}');
        });
    });
  });
});
