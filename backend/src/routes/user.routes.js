const { Router } = require('express');
const auth = require('../middleware/auth');
const { getAllUsers } = require('../controllers/user.controller');

const router = Router();

router.use(auth);

router.get('/', getAllUsers);

module.exports = router;
