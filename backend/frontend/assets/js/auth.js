// auth.js — handles JWT login, logout, portal protection

const AUTH_KEY = 'bt_token';
const USER_KEY = 'bt_user';

function saveAuth(token, user) {
  localStorage.setItem(AUTH_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
}

function getToken() { return localStorage.getItem(AUTH_KEY); }
function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
}
function isLoggedIn() { return !!getToken(); }
function isAdmin() { const u = getUser(); return u && u.role === 'admin'; }

// Protect portal pages — redirect to login if not authenticated
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/pages/portal/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    return false;
  }
  return true;
}

function requireAdmin() {
  if (!isLoggedIn() || !isAdmin()) {
    window.location.href = '/pages/portal/login.html';
    return false;
  }
  return true;
}

// Login form handler
async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type=submit]');
  const alert = form.querySelector('.form-alert');
  const email = form.querySelector('[name=email]').value;
  const password = form.querySelector('[name=password]').value;

  btn.innerHTML = '<span class="spinner"></span> Signing in...';
  btn.disabled = true;

  try {
    const data = await api.post('/auth/login', { email, password });
    saveAuth(data.token, data.user);
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    window.location.href = redirect || '/pages/portal/dashboard.html';
  } catch (err) {
    alert.className = 'alert alert-error';
    alert.textContent = '✗ ' + err.message;
    alert.style.display = 'block';
    btn.innerHTML = 'Sign In';
    btn.disabled = false;
  }
}

// Logout
function logout() {
  clearAuth();
  window.location.href = '/pages/portal/login.html';
}

// Update nav with user info
function updateNavUser() {
  const user = getUser();
  const userEl = document.getElementById('nav-user');
  const logoutBtn = document.getElementById('nav-logout');
  if (userEl && user) userEl.textContent = user.name;
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
}

window.auth = { saveAuth, clearAuth, getToken, getUser, isLoggedIn, isAdmin, requireAuth, requireAdmin, handleLogin, logout, updateNavUser };
