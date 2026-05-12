const express = require('express');
const router = express.Router();
const { createLead, getLeads, updateLeadStatus, deleteLead } = require('../controllers/leads.controller');
const { verifyJWT, requireRole } = require('../middleware/auth.middleware');
router.post('/', createLead);
router.get('/', verifyJWT, requireRole('admin'), getLeads);
router.patch('/:id/status', verifyJWT, requireRole('admin'), updateLeadStatus);
router.delete('/:id', verifyJWT, requireRole('admin'), deleteLead);
module.exports = router;
