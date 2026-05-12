const { Lead } = require('../models/index');
const { sendLeadNotification } = require('../config/mailer');

async function createLead(req, res) {
  try {
    const { name, email, phone, company, service_interest, message, source_page } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
    const lead = await Lead.create({ name, email, phone, company, service_interest, message, source_page: source_page || req.headers.referer });
    try { await sendLeadNotification(lead); } catch (e) { console.error('Email error:', e.message); }
    res.status(201).json({ message: 'Thank you! We will contact you shortly.', id: lead.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function getLeads(req, res) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = status ? { status } : {};
    const offset = (page - 1) * limit;
    const { count, rows } = await Lead.findAndCountAll({ where, order: [['created_at', 'DESC']], limit: parseInt(limit), offset });
    res.json({ leads: rows, total: count, page: parseInt(page), pages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function updateLeadStatus(req, res) {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    await lead.update({ status: req.body.status, notes: req.body.notes });
    res.json({ lead });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function deleteLead(req, res) {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    await lead.destroy();
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { createLead, getLeads, updateLeadStatus, deleteLead };
