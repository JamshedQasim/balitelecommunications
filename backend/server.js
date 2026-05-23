require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');

const { sequelize } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth.routes');
const leadsRoutes = require('./routes/leads.routes');
const servicesRoutes = require('./routes/services.routes');
const plansRoutes = require('./routes/plans.routes');
const ticketsRoutes = require('./routes/tickets.routes');
const invoicesRoutes = require('./routes/invoices.routes');
const blogRoutes = require('./routes/blog.routes');
const coverageRoutes = require('./routes/coverage.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust Hostinger's reverse proxy
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  contentSecurityPolicy: false
}));

// CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, process.env.FRONTEND_URL.replace('://', '://www.')]
  : true;
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', globalLimiter);

// Stricter limiter for auth & leads
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many attempts, please try again later.' }
});
app.use('/api/auth', strictLimiter);
// Only rate-limit POST /api/leads (public form submission), not admin reads/updates
app.use('/api/leads', (req, res, next) => {
  if (req.method === 'POST') return strictLimiter(req, res, next);
  next();
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/coverage', coverageRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve HTML pages for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/pages/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message
  });
});

// Start server
async function start() {
  // Always start the HTTP server so pages are served even if DB is down
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync({ alter: false });
    console.log('✅ Models synced');
  } catch (err) {
    console.error('⚠️  Database unavailable — site running in static mode:', err.message);
  }
}

start();
