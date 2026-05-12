const express = require('express');
const router = express.Router();
const { getCoverageAreas, createCoverageArea } = require('../controllers/main.controller');
const { verifyJWT, requireRole } = require('../middleware/auth.middleware');
router.get('/', getCoverageAreas);
router.post('/', verifyJWT, requireRole('admin'), createCoverageArea);
module.exports = router;
