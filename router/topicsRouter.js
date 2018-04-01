const router = require('express').Router();
const { getTopicsById, getTopics, getArticlesByTopicId } = require('../controllers/topicController');


router.get('/:topic_id/articles', getArticlesByTopicId);
router.get('/', getTopics)

module.exports = router;