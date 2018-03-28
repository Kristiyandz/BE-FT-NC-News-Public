const router = require('express').Router();
const { getTopics, getTopicsById } = require('../controllers/topicController');

router.get('/', getTopics);
router.get('/:topic_id', getTopicsById)

module.exports = router;