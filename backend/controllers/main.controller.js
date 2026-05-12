const { Service, Plan, BlogPost, CoverageArea, Ticket, Invoice } = require('../models/index');
const User = require('../models/User');
const { sendTicketConfirmation } = require('../config/mailer');

// ── Services ──────────────────────────────────────────
async function getServices(req, res) {
  try {
    const services = await Service.findAll({ where: { is_active: true }, order: [['sort_order', 'ASC']], include: [{ model: Plan, as: 'plans', where: { is_active: true }, required: false }] });
    res.json({ services });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function getService(req, res) {
  try {
    const service = await Service.findOne({ where: { slug: req.params.slug, is_active: true }, include: [{ model: Plan, as: 'plans', where: { is_active: true }, required: false }] });
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json({ service });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function createService(req, res) {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ service });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function updateService(req, res) {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Not found' });
    await service.update(req.body);
    res.json({ service });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

// ── Plans ──────────────────────────────────────────────
async function getPlans(req, res) {
  try {
    const where = { is_active: true };
    if (req.query.target) where.target = req.query.target;
    if (req.query.service_id) where.service_id = req.query.service_id;
    const plans = await Plan.findAll({ where, include: [{ model: Service, as: 'service' }], order: [['price_myr', 'ASC']] });
    res.json({ plans });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function createPlan(req, res) {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ plan });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function updatePlan(req, res) {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Not found' });
    await plan.update(req.body);
    res.json({ plan });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

// ── Blog ───────────────────────────────────────────────
async function getBlogPosts(req, res) {
  try {
    const { category, page = 1, limit = 9 } = req.query;
    const where = { is_published: true };
    if (category) where.category = category;
    const { count, rows } = await BlogPost.findAndCountAll({
      where, order: [['published_at', 'DESC']],
      limit: parseInt(limit), offset: (page - 1) * parseInt(limit),
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
    });
    res.json({ posts: rows, total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function getBlogPost(req, res) {
  try {
    const post = await BlogPost.findOne({
      where: { slug: req.params.slug, is_published: true },
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    await post.increment('views');
    res.json({ post });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function createBlogPost(req, res) {
  try {
    const post = await BlogPost.create({ ...req.body, author_id: req.user.id, published_at: req.body.is_published ? new Date() : null });
    res.status(201).json({ post });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function updateBlogPost(req, res) {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (req.body.is_published && !post.published_at) req.body.published_at = new Date();
    await post.update(req.body);
    res.json({ post });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function deleteBlogPost(req, res) {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

// ── Coverage ────────────────────────────────────────────
async function getCoverageAreas(req, res) {
  try {
    const areas = await CoverageArea.findAll({ order: [['city', 'ASC']] });
    res.json({ areas });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function createCoverageArea(req, res) {
  try {
    const area = await CoverageArea.create(req.body);
    res.status(201).json({ area });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

// ── Tickets ────────────────────────────────────────────
async function createTicket(req, res) {
  try {
    const { subject, description, category, priority } = req.body;
    if (!subject || !description) return res.status(400).json({ error: 'Subject and description required' });
    const ticket = await Ticket.create({ user_id: req.user.id, subject, description, category: category || 'general', priority: priority || 'medium' });
    try { await sendTicketConfirmation(req.user, ticket); } catch (e) { console.error('Email error:', e.message); }
    res.status(201).json({ ticket, message: 'Ticket created successfully' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function getMyTickets(req, res) {
  try {
    const tickets = await Ticket.findAll({ where: { user_id: req.user.id }, order: [['created_at', 'DESC']] });
    res.json({ tickets });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function getAllTickets(req, res) {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    const { count, rows } = await Ticket.findAndCountAll({
      where, include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'company'] }],
      order: [['created_at', 'DESC']], limit: parseInt(limit), offset: (page - 1) * parseInt(limit)
    });
    res.json({ tickets: rows, total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function updateTicketStatus(req, res) {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    if (req.user.role !== 'admin' && ticket.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    const updates = { status: req.body.status };
    if (req.body.admin_notes) updates.admin_notes = req.body.admin_notes;
    if (req.body.status === 'resolved') updates.resolved_at = new Date();
    await ticket.update(updates);
    res.json({ ticket });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

// ── Invoices ───────────────────────────────────────────
async function getMyInvoices(req, res) {
  try {
    const invoices = await Invoice.findAll({ where: { user_id: req.user.id }, include: [{ model: Plan, as: 'plan', include: [{ model: Service, as: 'service' }] }], order: [['created_at', 'DESC']] });
    res.json({ invoices });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function getAllInvoices(req, res) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = status ? { status } : {};
    const { count, rows } = await Invoice.findAndCountAll({
      where, include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'company'] }, { model: Plan, as: 'plan' }],
      order: [['created_at', 'DESC']], limit: parseInt(limit), offset: (page - 1) * parseInt(limit)
    });
    res.json({ invoices: rows, total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function createInvoice(req, res) {
  try {
    const { user_id, plan_id, amount, tax_amount, due_date, period_start, period_end } = req.body;
    const tax = parseFloat(tax_amount || 0);
    const inv_no = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    const invoice = await Invoice.create({ user_id, plan_id, invoice_no: inv_no, amount, tax_amount: tax, total_amount: parseFloat(amount) + tax, due_date, period_start, period_end });
    res.status(201).json({ invoice });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

async function updateInvoiceStatus(req, res) {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    const updates = { status: req.body.status };
    if (req.body.status === 'paid') updates.paid_at = new Date();
    await invoice.update(updates);
    res.json({ invoice });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

module.exports = {
  getServices, getService, createService, updateService,
  getPlans, createPlan, updatePlan,
  getBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost,
  getCoverageAreas, createCoverageArea,
  createTicket, getMyTickets, getAllTickets, updateTicketStatus,
  getMyInvoices, getAllInvoices, createInvoice, updateInvoiceStatus
};
