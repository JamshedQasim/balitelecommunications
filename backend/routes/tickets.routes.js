const express = require('express');
const router = express.Router();
const { createTicket, getMyTickets, getAllTickets, updateTicketStatus } = require('../controllers/main.controller');
const { verifyJWT, requireRole } = require('../middleware/auth.middleware');
router.post('/', verifyJWT, createTicket);
router.get('/my', verifyJWT, getMyTickets);
router.get('/all', verifyJWT, requireRole('admin'), getAllTickets);
router.patch('/:id/status', verifyJWT, updateTicketStatus);
module.exports = router;
