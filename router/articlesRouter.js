const router = require('express').Router();
const { getArticleById, getArticles,
  getCommentsByArticleId,
  updateArticleVote,
  postComment
} = require('../controllers/articleControl');

router.get('/', getArticles);
//router.put('/:comment_id', updateCommentVote);
router.put('/:article_id', updateArticleVote);
router.get('/:article_id/comments', getCommentsByArticleId);
router.get('/:article_id', getArticleById)
router.post('/:article_id/comments', postComment)

module.exports = router;
