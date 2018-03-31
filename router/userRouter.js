const router = require('express').Router()
const { getUserById } = require('../controllers/userControl');

// router.get('/', getUsers);
router.get('/:user_id', getUserById);

module.exports = router;