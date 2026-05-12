// components.js — injects nav and footer into every page

function getNavHTML(active = '') {
  const links = [
    { href: '/pages/index.html', label: 'Home', key: 'home' },
    { href: '/pages/about.html', label: 'About', key: 'about' },
    { href: '/pages/services/', label: 'Services', key: 'services', hasDropdown: true },
    { href: '/pages/enterprise.html', label: 'Enterprise', key: 'enterprise' },
    { href: '/pages/coverage.html', label: 'Coverage', key: 'coverage' },
    { href: '/pages/pricing.html', label: 'Pricing', key: 'pricing' },
    { href: '/pages/blog/index.html', label: 'Blog', key: 'blog' },
    { href: '/pages/support.html', label: 'Support', key: 'support' }
  ];
  const servicesDropdown = `
    <div class="absolute top-full left-0 mt-2 w-56 bg-[#0A1628] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div class="p-2">
        <a href="/pages/services/fiber-internet.html" class="block px-4 py-2 text-sm text-[#8BA4C8] hover:text-white hover:bg-white/5 rounded-lg">Fiber Internet</a>
        <a href="/pages/services/voip-solutions.html" class="block px-4 py-2 text-sm text-[#8BA4C8] hover:text-white hover:bg-white/5 rounded-lg">VoIP Solutions</a>
        <a href="/pages/services/cloud-communications.html" class="block px-4 py-2 text-sm text-[#8BA4C8] hover:text-white hover:bg-white/5 rounded-lg">Cloud Communications</a>
        <a href="/pages/services/managed-it.html" class="block px-4 py-2 text-sm text-[#8BA4C8] hover:text-white hover:bg-white/5 rounded-lg">Managed IT</a>
        <a href="/pages/services/security-systems.html" class="block px-4 py-2 text-sm text-[#8BA4C8] hover:text-white hover:bg-white/5 rounded-lg">Security Systems</a>
        <a href="/pages/services/network-infrastructure.html" class="block px-4 py-2 text-sm text-[#8BA4C8] hover:text-white hover:bg-white/5 rounded-lg">Network Infrastructure</a>
      </div>
    </div>`;

  const navLinks = links.map(l => {
    if (l.hasDropdown) {
      return `<div class="relative group">
        <a href="${l.href}" class="nav-link text-sm font-medium text-[#8BA4C8] hover:text-white transition-colors flex items-center gap-1 ${active===l.key?'active':''}">
          ${l.label} <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </a>${servicesDropdown}</div>`;
    }
    return `<a href="${l.href}" class="nav-link text-sm font-medium text-[#8BA4C8] hover:text-white transition-colors ${active===l.key?'active':''}">${l.label}</a>`;
  }).join('');

  return `
    <nav id="main-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a href="/pages/index.html" class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-br from-[#185FA5] to-[#2580E8] rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/></svg>
            </div>
            <span class="font-bold text-white" style="font-family:'Syne',sans-serif;font-size:15px;">Bali<span class="text-[#4DA3FF]">Telecom</span></span>
          </a>
          <div class="hidden lg:flex items-center gap-6">${navLinks}</div>
          <div class="flex items-center gap-3">
            <div id="network-status" class="hidden lg:block"></div>
            <a href="/pages/contact.html" class="btn-primary text-sm py-2 px-5">Talk to Sales</a>
            <button id="mobile-menu-btn" class="lg:hidden p-2 text-[#8BA4C8]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div id="mobile-menu" class="hidden lg:hidden border-t border-white/10">
        <div class="px-4 py-3 space-y-1">
          ${links.map(l => `<a href="${l.href}" class="block px-3 py-2 text-sm text-[#8BA4C8] hover:text-white">${l.label}</a>`).join('')}
          <a href="/pages/contact.html" class="block px-3 py-2 text-sm text-[#4DA3FF] font-semibold">Talk to Sales</a>
        </div>
      </div>
    </nav>`;
}

function getFooterHTML() {
  return `
    <footer class="border-t border-white/10 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div class="lg:col-span-2">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-[#185FA5] to-[#2580E8] rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/></svg>
              </div>
              <span class="font-bold text-white" style="font-family:'Syne',sans-serif;">Bali<span class="text-[#4DA3FF]">Telecom</span></span>
            </div>
            <p class="text-[#8BA4C8] text-sm leading-relaxed mb-6">Future-ready telecommunications infrastructure for businesses across Malaysia. Enterprise-grade connectivity, 24/7 support.</p>
            <div class="flex gap-3">
              <a href="#" class="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors text-[#8BA4C8] hover:text-white text-xs">in</a>
              <a href="#" class="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors text-[#8BA4C8] hover:text-white text-xs">tw</a>
              <a href="#" class="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors text-[#8BA4C8] hover:text-white text-xs">fb</a>
            </div>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-4" style="font-family:'Syne',sans-serif;">Services</h4>
            <ul class="space-y-2">
              ${['Fiber Internet','VoIP Solutions','Cloud Communications','Managed IT','Security Systems','Network Infrastructure'].map(s => `<li><a href="/pages/services/${s.toLowerCase().replace(/ /g,'-')}.html" class="text-[#8BA4C8] hover:text-white text-sm transition-colors">${s}</a></li>`).join('')}
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-4" style="font-family:'Syne',sans-serif;">Company</h4>
            <ul class="space-y-2">
              ${[['About Us','/pages/about.html'],['Enterprise','/pages/enterprise.html'],['Coverage','/pages/coverage.html'],['Pricing','/pages/pricing.html'],['Blog','/pages/blog/index.html'],['Careers','#']].map(([l,h]) => `<li><a href="${h}" class="text-[#8BA4C8] hover:text-white text-sm transition-colors">${l}</a></li>`).join('')}
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-4" style="font-family:'Syne',sans-serif;">Support</h4>
            <ul class="space-y-2">
              ${[['Support','/pages/support.html'],['Contact Us','/pages/contact.html'],['Client Portal','/pages/portal/login.html'],['Privacy Policy','#'],['Terms & Conditions','#']].map(([l,h]) => `<li><a href="${h}" class="text-[#8BA4C8] hover:text-white text-sm transition-colors">${l}</a></li>`).join('')}
            </ul>
            <div class="mt-6 space-y-2">
              <a href="tel:+60312345678" class="flex items-center gap-2 text-[#8BA4C8] hover:text-white text-sm transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                +603-1234-5678
              </a>
              <a href="mailto:info@balitelecommunications.com" class="flex items-center gap-2 text-[#8BA4C8] hover:text-white text-sm transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                info@balitelecommunications.com
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-[#8BA4C8] text-xs">© 2026 Bali Telecommunications Sdn Bhd. All rights reserved. (SSM: 1234567-X)</p>
          <p class="text-[#8BA4C8] text-xs">99.9% Network Uptime · 24/7 Technical Support · Enterprise-Grade Infrastructure</p>
        </div>
      </div>
    </footer>`;
}

window.components = { getNavHTML, getFooterHTML };
