// auth.routes.js
const express = require('express');
const router = express.Router();
const { login, register, getMe, updateProfile, changePassword } = require('../controllers/auth.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
router.post('/login', login);
router.post('/register', register);
router.get('/me', verifyJWT, getMe);
router.put('/profile', verifyJWT, updateProfile);
router.put('/password', verifyJWT, changePassword);
module.exports = router;
