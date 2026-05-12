const express = require('express');
const router = express.Router();
const { verifyJWT, requireRole } = require('../middleware/auth.middleware');
const User = require('../models/User');
const { Lead, Ticket, Invoice } = require('../models/index');
const { Op } = require('sequelize');

router.use(verifyJWT, requireRole('admin'));

router.get('/stats', async (req, res) => {
  try {
    const [totalLeads, newLeads, openTickets, unpaidInvoices, totalUsers] = await Promise.all([
      Lead.count(),
      Lead.count({ where: { status: 'new' } }),
      Ticket.count({ where: { status: ['open', 'in_progress'] } }),
      Invoice.count({ where: { status: 'unpaid' } }),
      User.count({ where: { role: 'client' } })
    ]);
    res.json({ stats: { totalLeads, newLeads, openTickets, unpaidInvoices, totalUsers } });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({ order: [['created_at', 'DESC']] });
    res.json({ users });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
