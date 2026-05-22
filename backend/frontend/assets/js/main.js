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
      nav.style.background = 'rgba(255,255,255,0.98)';
      nav.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    } else {
      nav.style.background = 'rgba(255,255,255,0.95)';
      nav.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
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
  let w, h, nodes = [], packets = [], bgRings = [], animId;
  let mouse = { x: -9999, y: -9999 };
  const MAX_D = 170;
  const PACKET_CAP = 55;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function init() {
    const mobile = w < 640;
    const total = mobile ? 38 : 70;
    const hubCount = mobile ? 5 : 10;

    nodes = Array.from({ length: total }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: i < hubCount ? Math.random() * 2.5 + 3.5 : Math.random() * 1.5 + 0.8,
      isHub: i < hubCount,
      phase: Math.random() * Math.PI * 2,
      phaseSpd: 0.012 + Math.random() * 0.014
    }));

    bgRings = Array.from({ length: mobile ? 3 : 6 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 70 + Math.random() * 130,
      phase: Math.random() * Math.PI * 2,
      spd: 0.004 + Math.random() * 0.003
    }));

    packets = [];
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Background orbital rings
    bgRings.forEach(ring => {
      ring.phase += ring.spd;
      const r1 = ring.r + Math.sin(ring.phase) * 14;
      const r2 = ring.r * 1.6 + Math.sin(ring.phase + 1.2) * 20;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, r1, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(37,99,235,${0.13 + Math.sin(ring.phase) * 0.04})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, r2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(14,165,233,${0.07 + Math.sin(ring.phase + 1.2) * 0.02})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    });

    // Move nodes
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -45) n.x = w + 45;
      if (n.x > w + 45) n.x = -45;
      if (n.y < -45) n.y = h + 45;
      if (n.y > h + 45) n.y = -45;
      n.phase += n.phaseSpd;

      // Mouse repulsion
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 14000 && d2 > 1) {
        const d = Math.sqrt(d2);
        const f = Math.min(2.5, 110 / d);
        n.x += (dx / d) * f;
        n.y += (dy / d) * f;
      }
    });

    // Build edges and draw connections
    const edgeList = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_D) {
          edgeList.push([i, j]);
          const f = 1 - d / MAX_D;
          const hubEdge = nodes[i].isHub || nodes[j].isHub;
          ctx.beginPath();
          ctx.strokeStyle = hubEdge
            ? `rgba(37,99,235,${f * 0.65})`
            : `rgba(37,99,235,${f * 0.35})`;
          ctx.lineWidth = hubEdge ? 1.0 : 0.55;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Spawn packets along existing edges
    if (edgeList.length && Math.random() < 0.09 && packets.length < PACKET_CAP) {
      const [a, b] = edgeList[Math.floor(Math.random() * edgeList.length)];
      const rev = Math.random() > 0.5;
      packets.push({ a: rev ? b : a, b: rev ? a : b, t: 0, spd: 0.0045 + Math.random() * 0.005 });
    }

    // Hub pulse rings (3 rings per hub)
    nodes.forEach(n => {
      if (!n.isHub) return;
      for (let ring = 1; ring <= 3; ring++) {
        const rr = n.r + ring * 5.5 + Math.sin(n.phase * 0.65 * ring) * 4;
        const alpha = (0.35 / ring) * (0.55 + Math.sin(n.phase) * 0.45);
        ctx.beginPath();
        ctx.arc(n.x, n.y, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(n => {
      if (n.isHub) {
        // Soft radial glow for hubs
        const g = ctx.createRadialGradient(n.x, n.y, n.r * 0.3, n.x, n.y, n.r * 5.5);
        g.addColorStop(0, 'rgba(77,163,255,0.22)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      // Core circle
      const gAlpha = n.isHub ? 0.85 + Math.sin(n.phase) * 0.15 : 0.7;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37,99,235,${gAlpha})`;
      ctx.fill();
      // Bright inner core for hubs
      if (n.isHub) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.fill();
      }
    });

    // Update and draw data packets
    packets = packets.filter(p => p.t <= 1);
    packets.forEach(p => {
      p.t = Math.min(1, p.t + p.spd);
      const na = nodes[p.a], nb = nodes[p.b];
      const x = na.x + (nb.x - na.x) * p.t;
      const y = na.y + (nb.y - na.y) * p.t;

      // Tail segments
      const TAIL = 12;
      for (let k = TAIL; k >= 0; k--) {
        const tt = Math.max(0, p.t - k * 0.016);
        const tx = na.x + (nb.x - na.x) * tt;
        const ty = na.y + (nb.y - na.y) * tt;
        const tailAlpha = (1 - k / TAIL) * 0.7;
        const tailR = k === 0 ? 2.4 : Math.max(0.15, 1.9 - k * 0.15);
        ctx.beginPath();
        ctx.arc(tx, ty, tailR, 0, Math.PI * 2);
        ctx.fillStyle = k === 0
          ? 'rgba(30,58,150,0.95)'
          : `rgba(59,130,246,${tailAlpha})`;
        ctx.fill();
      }

      // Head glow halo
      const hg = ctx.createRadialGradient(x, y, 0, x, y, 9);
      hg.addColorStop(0, 'rgba(37,99,235,0.3)');
      hg.addColorStop(1, 'rgba(37,99,235,0)');
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = hg;
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  // Track mouse through window (canvas is pointer-events:none)
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom + 40) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    } else {
      mouse.x = -9999; mouse.y = -9999;
    }
  });

  resize();
  init();
  draw();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    init();
    draw();
  });
}

// ── Network Status ────────────────────────────────────
async function initNetworkStatus() {
  const el = document.getElementById('network-status');
  if (!el) return;
  try {
    await api.get('/health');
    el.innerHTML = '<a href="/pages/status.html" class="status-badge status-up" style="text-decoration:none;"><span class="dot-pulse"></span> All Systems Operational</a>';
  } catch {
    el.innerHTML = '<a href="/pages/status.html" class="status-badge status-warning" style="text-decoration:none;"><span class="dot-pulse"></span> Checking status...</a>';
  }
}

// ── WhatsApp Button ───────────────────────────────────
function initWhatsApp() {
  const btn = document.getElementById('whatsapp-btn');
  if (!btn) return;
  const num = btn.dataset.number || '923373819147';
  btn.href = `https://wa.me/${num}`;
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
