const router = require('express').Router();
const { updateComments, deleteComment } = require('../controllers/commentsControl')


router.delete('/:comments_id', deleteComment)
router.put('/:comment_id', updateComments);

module.exports = router;