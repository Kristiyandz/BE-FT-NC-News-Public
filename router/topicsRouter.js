const router = require('express').Router();
const { getTopics, getArticlesByTopicId, getTopicsById } = require('../controllers/topicController');

router.get('/', getTopics);
router.get('/:topic_id', getTopicsById)
router.get('/:topic_id/articles', getArticlesByTopicId)

module.exports = router;