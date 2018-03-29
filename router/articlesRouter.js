const router = require('express').Router();
const { getArticles,
  getCommentsByArticleId,
  addComment,
  updateArticleVote
} = require('../controllers/articleControl');

router.get('/', getArticles);
//router.put('/:comment_id', updateCommentVote);
router.put('/:article_id', updateArticleVote);
router.post('/:article_id/comments', addComment);
router.get('/:article_id/comments', getCommentsByArticleId);

module.exports = router;
