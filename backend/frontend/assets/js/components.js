// components.js — injects nav and footer into every page

function getNavHTML(active = '') {
  const links = [
    { href: '/pages/index.html', label: 'Home', key: 'home' },
    { href: '/pages/about.html', label: 'About', key: 'about' },
    { href: '/pages/services/', label: 'Services', key: 'services', hasDropdown: true },
    { href: '/pages/enterprise.html', label: 'Enterprise', key: 'enterprise' },
    { href: '/pages/coverage.html', label: 'Coverage', key: 'coverage' },
    { href: '/pages/blog/index.html', label: 'Blog', key: 'blog' },
    { href: '/pages/support.html', label: 'Support', key: 'support' }
  ];
  const servicesDropdown = `
    <div class="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div class="p-2">
        <a href="/pages/services/fiber-internet.html" class="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Fiber Internet</a>
        <a href="/pages/services/voip-solutions.html" class="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">VoIP Solutions</a>
        <a href="/pages/services/cloud-communications.html" class="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Cloud Communications</a>
        <a href="/pages/services/managed-it.html" class="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Managed IT</a>
        <a href="/pages/services/security-systems.html" class="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Security Systems</a>
        <a href="/pages/services/network-infrastructure.html" class="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Network Infrastructure</a>
      </div>
    </div>`;

  const navLinks = links.map(l => {
    if (l.hasDropdown) {
      return `<div class="relative group">
        <a href="${l.href}" class="nav-link text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 ${active===l.key?'active':''}">
          ${l.label} <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </a>${servicesDropdown}</div>`;
    }
    return `<a href="${l.href}" class="nav-link text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors ${active===l.key?'active':''}">${l.label}</a>`;
  }).join('');

  return `
    <nav id="main-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a href="/pages/index.html" class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-br from-[#1a56db] to-[#2563eb] rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/></svg>
            </div>
            <span class="font-bold text-[#1e3a5f]" style="font-family:'Syne',sans-serif;font-size:15px;">Bali<span class="text-blue-600">Telecom</span></span>
          </a>
          <div class="hidden lg:flex items-center gap-6">${navLinks}</div>
          <div class="flex items-center gap-3">
            <div id="network-status" class="hidden lg:block"></div>
            <a href="/pages/contact.html" class="btn-primary text-sm py-2 px-5">Talk to Sales</a>
            <button id="mobile-menu-btn" class="lg:hidden p-2 text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div id="mobile-menu" class="hidden lg:hidden border-t border-gray-100 bg-white">
        <div class="px-4 py-3 space-y-1">
          ${links.map(l => `<a href="${l.href}" class="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">${l.label}</a>`).join('')}
          <a href="/pages/contact.html" class="block px-3 py-2 text-sm text-blue-600 font-semibold">Talk to Sales</a>
        </div>
      </div>
    </nav>`;
}

function getFooterHTML() {
  return `
    <footer class="border-t border-gray-100 mt-20" style="background:#0f172a;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div class="lg:col-span-2">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-[#1a56db] to-[#2563eb] rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/></svg>
              </div>
              <span class="font-bold text-white" style="font-family:'Syne',sans-serif;">Bali<span class="text-blue-400">Telecom</span></span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed mb-6">Future-ready telecommunications infrastructure for businesses across Pakistan. Enterprise-grade connectivity, 24/7 support.</p>
            <div class="flex gap-3">
              <a href="#" class="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors text-gray-400 hover:text-white text-xs">in</a>
              <a href="#" class="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors text-gray-400 hover:text-white text-xs">tw</a>
              <a href="#" class="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors text-gray-400 hover:text-white text-xs">fb</a>
            </div>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-4" style="font-family:'Syne',sans-serif;">Services</h4>
            <ul class="space-y-2">
              ${['Fiber Internet','VoIP Solutions','Cloud Communications','Managed IT','Security Systems','Network Infrastructure'].map(s => `<li><a href="/pages/services/${s.toLowerCase().replace(/ /g,'-')}.html" class="text-gray-400 hover:text-white text-sm transition-colors">${s}</a></li>`).join('')}
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-4" style="font-family:'Syne',sans-serif;">Company</h4>
            <ul class="space-y-2">
              ${[['About Us','/pages/about.html'],['Enterprise','/pages/enterprise.html'],['Coverage','/pages/coverage.html'],['Blog','/pages/blog/index.html'],['Careers','#']].map(([l,h]) => `<li><a href="${h}" class="text-gray-400 hover:text-white text-sm transition-colors">${l}</a></li>`).join('')}
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-4" style="font-family:'Syne',sans-serif;">Contact</h4>
            <ul class="space-y-2 mb-4">
              ${[['Support','/pages/support.html'],['Contact Us','/pages/contact.html'],['System Status','/pages/status.html'],['Client Portal','/pages/portal/login.html'],['Privacy Policy','#'],['Terms','#']].map(([l,h]) => `<li><a href="${h}" class="text-gray-400 hover:text-white text-sm transition-colors">${l}</a></li>`).join('')}
            </ul>
            <div class="space-y-2.5">
              <a href="tel:+923373819147" class="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                +92 337 3819147
              </a>
              <a href="https://wa.me/923373819147" target="_blank" rel="noopener" class="flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm transition-colors">
                <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Chat
              </a>
              <a href="mailto:shahdostd@gmail.com" class="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                shahdostd@gmail.com
              </a>
              <div class="flex items-start gap-2 text-gray-400 text-sm">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Balitelecommunication, Pasni Road, Turbat
              </div>
            </div>
          </div>
        </div>
        <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-gray-500 text-xs">© 2026 Bali Telecommunications. All rights reserved.</p>
          <p class="text-gray-500 text-xs">99.9% Network Uptime · 24/7 Technical Support · Serving Businesses Across Pakistan</p>
        </div>
      </div>
    </footer>`;
}

window.components = { getNavHTML, getFooterHTML };

