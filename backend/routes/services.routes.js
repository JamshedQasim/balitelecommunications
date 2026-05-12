const express = require('express');
const router = express.Router();
const { getServices, getService, createService, updateService } = require('../controllers/main.controller');
const { verifyJWT, requireRole } = require('../middleware/auth.middleware');
router.get('/', getServices);
router.get('/:slug', getService);
router.post('/', verifyJWT, requireRole('admin'), createService);
router.put('/:id', verifyJWT, requireRole('admin'), updateService);
module.exports = router;
