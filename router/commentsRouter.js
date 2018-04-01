const router = require('express').Router();
const { getAllComments, updateComments, deleteComment } = require('../controllers/commentsControl')


router.delete('/:comments_id', deleteComment)
router.put('/:comment_id', updateComments);
router.get('/', getAllComments);

module.exports = router;