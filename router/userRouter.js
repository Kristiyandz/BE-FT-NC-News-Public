const router = require('express').Router()
const { getUsers, getUserByUsername } = require('../controllers/userControl');

router.get('/:username', getUserByUsername);
router.get('/', getUsers);

module.exports = router;