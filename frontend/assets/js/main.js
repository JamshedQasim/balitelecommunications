// ── API Helper ────────────────────────────────────────
const API_BASE = '/api';

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('bt_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

window.api = {
  get: (url) => apiFetch(url),
  post: (url, body) => apiFetch(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url, body) => apiFetch(url, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (url, body) => apiFetch(url, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url) => apiFetch(url, { method: 'DELETE' })
};

// ── Navigation ────────────────────────────────────────
function initNav() {
  const nav = document.getElementById('main-nav');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.background = 'rgba(6,14,30,0.97)';
    } else {
      nav.style.background = 'rgba(6,14,30,0.85)';
    }
  });

  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Set active link
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (link.href === window.location.href) link.classList.add('active');
  });
}

// ── Lead Form ─────────────────────────────────────────
function initLeadForms() {
  document.querySelectorAll('.lead-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const alertEl = form.querySelector('.form-alert');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> Sending...';
      btn.disabled = true;

      const data = Object.fromEntries(new FormData(form));
      data.source_page = window.location.pathname;

      try {
        await api.post('/leads', data);
        if (alertEl) {
          alertEl.className = 'alert alert-success';
          alertEl.textContent = '✓ Thank you! Our team will contact you within 24 hours.';
          alertEl.style.display = 'block';
        }
        form.reset();
      } catch (err) {
        if (alertEl) {
          alertEl.className = 'alert alert-error';
          alertEl.textContent = '✗ ' + err.message;
          alertEl.style.display = 'block';
        }
      } finally {
        btn.innerHTML = orig;
        btn.disabled = false;
      }
    });
  });
}

// ── Counter Animation ─────────────────────────────────
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.counter), el.dataset.suffix || '');
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// ── Scroll Reveal ─────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    obs.observe(el);
  });
}

// ── Hero Canvas Animation ─────────────────────────────
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [], edges = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function createNodes(count = 50) {
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(37,128,232,${0.25 * (1 - d / 140)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(77,163,255,0.6)';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  createNodes();
  draw();
  window.addEventListener('resize', () => { resize(); createNodes(); });
}

// ── Network Status ────────────────────────────────────
async function initNetworkStatus() {
  const el = document.getElementById('network-status');
  if (!el) return;
  try {
    await api.get('/health');
    el.innerHTML = '<span class="status-badge status-up"><span class="dot-pulse"></span> All Systems Operational</span>';
  } catch {
    el.innerHTML = '<span class="status-badge status-warning"><span class="dot-pulse"></span> Checking status...</span>';
  }
}

// ── WhatsApp Button ───────────────────────────────────
function initWhatsApp() {
  const btn = document.getElementById('whatsapp-btn');
  if (!btn) return;
  const num = btn.dataset.number || '60123456789';
  btn.href = `https://wa.me/${num}?text=Hello%2C%20I%27m%20interested%20in%20your%20telecom%20services.`;
}

// ── Init All ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initLeadForms();
  initCounters();
  initScrollReveal();
  initHeroCanvas();
  initNetworkStatus();
  initWhatsApp();
});
