const router = require('express').Router();
const { getAllComments, getCommentsById, updateComments, deleteComment } = require('../controllers/commentsControl');


router.delete('/:comment_id', deleteComment);
router.put('/:comment_id', updateComments);
router.get('/:comment_id', getCommentsById);
router.get('/', getAllComments);

module.exports = router;