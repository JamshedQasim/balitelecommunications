const express = require('express');
const router = express.Router();
const { getMyInvoices, getAllInvoices, createInvoice, updateInvoiceStatus } = require('../controllers/main.controller');
const { verifyJWT, requireRole } = require('../middleware/auth.middleware');
router.get('/my', verifyJWT, getMyInvoices);
router.get('/all', verifyJWT, requireRole('admin'), getAllInvoices);
router.post('/', verifyJWT, requireRole('admin'), createInvoice);
router.patch('/:id/status', verifyJWT, requireRole('admin'), updateInvoiceStatus);
module.exports = router;
