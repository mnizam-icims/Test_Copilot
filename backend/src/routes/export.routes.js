const { Router } = require('express');
const auth = require('../middleware/auth');
const { exportCSV, exportPDF } = require('../controllers/export.controller');

const router = Router();

router.use(auth);

router.get('/csv', exportCSV);
router.get('/pdf', exportPDF);

module.exports = router;
