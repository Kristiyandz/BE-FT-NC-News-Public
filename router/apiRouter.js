const router = require('express').Router();
const { getStatus } = require('../controllers/apiControl');
const topicRouter = require('./topicsRouter');
const articleRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const userRouter = require('./userRouter');

router.get('/', getStatus)
router.use('/topics', topicRouter)
router.use('/articles', articleRouter);
router.use('/comments', commentsRouter);
router.use('/users', userRouter)

module.exports = router;