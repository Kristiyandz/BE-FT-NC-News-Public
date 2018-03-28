const router = require('express').Router();
const { getArticles, getCommentsByArticleId, addComment, updateVote } = require('../controllers/articleControl');

router.get('/', getArticles);
router.put('/:article_id', updateVote);
router.post('/:article_id/comments', addComment);
router.get('/:article_id/comments', getCommentsByArticleId);

module.exports = router;
