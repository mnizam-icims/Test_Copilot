const { Router } = require('express');
const auth = require('../middleware/auth');
const { getSummary } = require('../controllers/dashboard.controller');

const router = Router();

router.use(auth);

router.get('/summary', getSummary);

module.exports = router;
