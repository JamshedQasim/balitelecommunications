const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define('Service', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  slug: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  short_desc: { type: DataTypes.STRING(300) },
  icon: { type: DataTypes.STRING(100) },
  image: { type: DataTypes.STRING(255) },
  features: { type: DataTypes.JSON },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'services' });

const Plan = sequelize.define('Plan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  service_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'services', key: 'id' } },
  name: { type: DataTypes.STRING(100), allowNull: false },
  speed_mbps: { type: DataTypes.INTEGER },
  price_myr: { type: DataTypes.DECIMAL(10, 2) },
  sla_uptime: { type: DataTypes.DECIMAL(5, 2), defaultValue: 99.9 },
  target: { type: DataTypes.ENUM('sme', 'enterprise'), defaultValue: 'sme' },
  features: { type: DataTypes.JSON },
  is_popular: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'plans' });

const Lead = sequelize.define('Lead', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(30) },
  company: { type: DataTypes.STRING(200) },
  service_interest: { type: DataTypes.STRING(100) },
  message: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('new', 'contacted', 'converted', 'lost'), defaultValue: 'new' },
  source_page: { type: DataTypes.STRING(100) },
  notes: { type: DataTypes.TEXT }
}, { tableName: 'leads' });

const Ticket = sequelize.define('Ticket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
  subject: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.ENUM('technical', 'billing', 'general', 'complaint'), defaultValue: 'general' },
  priority: { type: DataTypes.ENUM('low', 'medium', 'high', 'critical'), defaultValue: 'medium' },
  status: { type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'), defaultValue: 'open' },
  admin_notes: { type: DataTypes.TEXT },
  resolved_at: { type: DataTypes.DATE }
}, { tableName: 'tickets' });

const Invoice = sequelize.define('Invoice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
  plan_id: { type: DataTypes.INTEGER, references: { model: 'plans', key: 'id' } },
  invoice_no: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  tax_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  due_date: { type: DataTypes.DATEONLY },
  paid_at: { type: DataTypes.DATE },
  status: { type: DataTypes.ENUM('unpaid', 'paid', 'overdue'), defaultValue: 'unpaid' },
  pdf_path: { type: DataTypes.STRING(255) },
  period_start: { type: DataTypes.DATEONLY },
  period_end: { type: DataTypes.DATEONLY }
}, { tableName: 'invoices' });

const BlogPost = sequelize.define('BlogPost', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  excerpt: { type: DataTypes.STRING(400) },
  content: { type: DataTypes.TEXT('long') },
  meta_description: { type: DataTypes.STRING(160) },
  cover_image: { type: DataTypes.STRING(255) },
  author_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
  category: { type: DataTypes.STRING(100) },
  tags: { type: DataTypes.JSON },
  published_at: { type: DataTypes.DATE },
  is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
  views: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'blog_posts' });

const CoverageArea = sequelize.define('CoverageArea', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  city: { type: DataTypes.STRING(100), allowNull: false },
  state: { type: DataTypes.STRING(100) },
  lat: { type: DataTypes.DECIMAL(10, 7) },
  lng: { type: DataTypes.DECIMAL(10, 7) },
  coverage_type: { type: DataTypes.ENUM('fiber', 'wireless', 'satellite', 'full'), defaultValue: 'fiber' },
  status: { type: DataTypes.ENUM('available', 'coming_soon', 'unavailable'), defaultValue: 'available' },
  data_centers: { type: DataTypes.JSON }
}, { tableName: 'coverage_areas' });

// Associations
Service.hasMany(Plan, { foreignKey: 'service_id', as: 'plans' });
Plan.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

const User = require('./User');
User.hasMany(Ticket, { foreignKey: 'user_id', as: 'tickets' });
Ticket.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Invoice, { foreignKey: 'user_id', as: 'invoices' });
Invoice.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Plan.hasMany(Invoice, { foreignKey: 'plan_id', as: 'invoices' });
Invoice.belongsTo(Plan, { foreignKey: 'plan_id', as: 'plan' });
User.hasMany(BlogPost, { foreignKey: 'author_id', as: 'posts' });
BlogPost.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

module.exports = { Service, Plan, Lead, Ticket, Invoice, BlogPost, CoverageArea };
