const express = require('express');
const router = express.Router();
const { getPlans, createPlan, updatePlan } = require('../controllers/main.controller');
const { verifyJWT, requireRole } = require('../middleware/auth.middleware');
router.get('/', getPlans);
router.post('/', verifyJWT, requireRole('admin'), createPlan);
router.put('/:id', verifyJWT, requireRole('admin'), updatePlan);
module.exports = router;
