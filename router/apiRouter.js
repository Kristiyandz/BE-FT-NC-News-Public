const router = require('express').Router();
const topicRouter = require('./topicsRouter');
const articleRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const userRouter = require('./userRouter');


router.use('/topics', topicRouter)
router.use('/articles', articleRouter);
router.use('/comments', commentsRouter);
router.use('/users', userRouter)
router.get('/', (req, res) => {
  res.status(200).send({ status: "OK" });
})

module.exports = router;