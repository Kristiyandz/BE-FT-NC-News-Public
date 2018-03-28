const router = require('express').Router();
const { getStatus } = require('../controllers/apiControl');
const topicRouter = require('./topicsRouter');
const articleRouter = require('./articlesRouter');

router.get('/', getStatus)
router.use('/topics', topicRouter)
router.use('/articles', articleRouter);

module.exports = router;