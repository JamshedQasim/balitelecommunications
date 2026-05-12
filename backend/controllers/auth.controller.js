const User = require('../models/User');
const { generateToken } = require('../middleware/auth.middleware');
const bcrypt = require('bcryptjs');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ where: { email } });
    if (!user || !user.is_active) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await user.validatePassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function register(req, res) {
  try {
    const { name, email, password, company, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, password_hash: password, company, phone, role: 'client' });
    const token = generateToken(user);
    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function getMe(req, res) {
  res.json({ user: req.user.toJSON() });
}

async function updateProfile(req, res) {
  try {
    const { name, company, phone } = req.body;
    await req.user.update({ name, company, phone });
    res.json({ user: req.user.toJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function changePassword(req, res) {
  try {
    const { current_password, new_password } = req.body;
    const valid = await req.user.validatePassword(current_password);
    if (!valid) return res.status(400).json({ error: 'Current password incorrect' });
    if (new_password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    const hash = await bcrypt.hash(new_password, 12);
    await req.user.update({ password_hash: hash });
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { login, register, getMe, updateProfile, changePassword };
