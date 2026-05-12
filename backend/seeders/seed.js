// Run: node seeders/seed.js
require('dotenv').config();
const { sequelize } = require('../config/database');
const User = require('../models/User');
const { Service, Plan, BlogPost, CoverageArea } = require('../models/index');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('Tables created');

  // Admin user
  await User.create({ name: 'Admin', email: 'admin@balitelecommunications.com', password_hash: 'Admin@1234', role: 'admin', company: 'Bali Telecommunications', phone: '+60123456789' });
  // Demo client
  await User.create({ name: 'Ahmad Ridzwan', email: 'client@example.com', password_hash: 'Client@1234', role: 'client', company: 'ABC Sdn Bhd', phone: '+60187654321' });
  console.log('Users seeded');

  // Services
  const services = await Service.bulkCreate([
    { name: 'Fiber Internet', slug: 'fiber-internet', short_desc: 'Ultra-fast dedicated fiber connectivity for businesses.', description: 'Enterprise-grade fiber internet with symmetrical upload and download speeds, 99.9% uptime SLA, and 24/7 monitoring.', icon: 'signal', features: ['Symmetrical speeds', 'Dedicated line', 'Static IP', '24/7 NOC'], sort_order: 1 },
    { name: 'VoIP Solutions', slug: 'voip-solutions', short_desc: 'Crystal-clear business voice over IP.', description: 'Reduce communication costs with our enterprise VoIP platform. HD voice quality, unlimited extensions, and advanced call routing.', icon: 'phone', features: ['HD voice quality', 'Unlimited extensions', 'IVR system', 'Call recording'], sort_order: 2 },
    { name: 'Cloud Communications', slug: 'cloud-communications', short_desc: 'Unified communications in the cloud.', description: 'Integrate voice, video, messaging, and collaboration in one platform.', icon: 'cloud', features: ['Video conferencing', 'Instant messaging', 'File sharing', 'Mobile app'], sort_order: 3 },
    { name: 'Managed IT Services', slug: 'managed-it', short_desc: 'Full IT management so you can focus on business.', description: 'Proactive monitoring, maintenance, and support for your entire IT infrastructure.', icon: 'server', features: ['24/7 monitoring', 'Patch management', 'Help desk', 'Network management'], sort_order: 4 },
    { name: 'Security Systems', slug: 'security-systems', short_desc: 'CCTV, access control, and cyber security.', description: 'End-to-end physical and cyber security solutions for your premises and network.', icon: 'shield', features: ['IP CCTV', 'Access control', 'Firewall', 'Threat monitoring'], sort_order: 5 },
    { name: 'Network Infrastructure', slug: 'network-infrastructure', short_desc: 'Design and deploy enterprise networks.', description: 'Complete network design, cabling, switching, routing, and Wi-Fi deployment.', icon: 'network', features: ['Structured cabling', 'SD-WAN', 'Wi-Fi 6', 'Network audit'], sort_order: 6 }
  ]);
  console.log('Services seeded');

  // Plans for Fiber Internet
  await Plan.bulkCreate([
    { service_id: services[0].id, name: 'Business 100', speed_mbps: 100, price_myr: 299, sla_uptime: 99.5, target: 'sme', features: ['100 Mbps symmetrical', '1 Static IP', 'Email support', '99.5% SLA'], is_popular: false },
    { service_id: services[0].id, name: 'Business 500', speed_mbps: 500, price_myr: 599, sla_uptime: 99.9, target: 'sme', features: ['500 Mbps symmetrical', '5 Static IPs', 'Priority support', '99.9% SLA', 'Free router'], is_popular: true },
    { service_id: services[0].id, name: 'Enterprise 1G', speed_mbps: 1000, price_myr: 1299, sla_uptime: 99.99, target: 'enterprise', features: ['1 Gbps symmetrical', '/29 IP block', 'Dedicated account manager', '99.99% SLA', 'Free CPE', '4hr SLA response'] },
    { service_id: services[0].id, name: 'Enterprise 10G', speed_mbps: 10000, price_myr: 4999, sla_uptime: 99.99, target: 'enterprise', features: ['10 Gbps symmetrical', '/28 IP block', 'Dedicated support line', '99.99% SLA', 'Premium CPE', '2hr SLA response'] }
  ]);
  console.log('Plans seeded');

  // Blog posts
  const admin = await User.findOne({ where: { role: 'admin' } });
  await BlogPost.bulkCreate([
    { title: 'What Is Dedicated Internet and Why Your Business Needs It', slug: 'what-is-dedicated-internet', excerpt: 'Learn the difference between dedicated and shared internet, and why enterprise businesses should always choose dedicated.', content: '<p>Dedicated internet access (DIA) provides your business with a private, unshared connection to the internet...</p>', category: 'Education', tags: ['internet', 'dedicated', 'enterprise'], author_id: admin.id, is_published: true, published_at: new Date() },
    { title: 'Fiber vs Wireless Internet for Business: Which Is Right for You?', slug: 'fiber-vs-wireless-internet', excerpt: 'Compare fiber and wireless business internet on speed, reliability, and cost to make the right choice.', content: '<p>Choosing the right internet technology can significantly impact your business operations...</p>', category: 'Comparison', tags: ['fiber', 'wireless', 'comparison'], author_id: admin.id, is_published: true, published_at: new Date() },
    { title: 'Top 5 Benefits of VoIP for Small and Medium Businesses', slug: 'benefits-of-voip-for-business', excerpt: 'VoIP can slash your phone bills and supercharge your team communications. Here is how.', content: '<p>Voice over Internet Protocol (VoIP) has transformed business communications...</p>', category: 'VoIP', tags: ['voip', 'business', 'savings'], author_id: admin.id, is_published: true, published_at: new Date() },
    { title: 'How SD-WAN Improves Multi-Branch Connectivity', slug: 'how-sd-wan-improves-connectivity', excerpt: 'SD-WAN gives enterprises flexibility, visibility, and performance across all branch locations.', content: '<p>Software-Defined Wide Area Network (SD-WAN) is revolutionizing how enterprises connect their branches...</p>', category: 'Enterprise', tags: ['sd-wan', 'enterprise', 'networking'], author_id: admin.id, is_published: true, published_at: new Date() },
    { title: 'Cybersecurity Best Practices for Telecom Networks in 2026', slug: 'cybersecurity-telecom-networks-2026', excerpt: 'Protect your business network against modern threats with these proven cybersecurity strategies.', content: '<p>Cyber threats targeting business networks have become increasingly sophisticated...</p>', category: 'Security', tags: ['cybersecurity', 'network', 'protection'], author_id: admin.id, is_published: true, published_at: new Date() }
  ]);
  console.log('Blog posts seeded');

  // Coverage areas
  await CoverageArea.bulkCreate([
    { city: 'Kuala Lumpur', state: 'Wilayah Persekutuan', lat: 3.1390, lng: 101.6869, coverage_type: 'full', status: 'available' },
    { city: 'Petaling Jaya', state: 'Selangor', lat: 3.1073, lng: 101.6067, coverage_type: 'full', status: 'available' },
    { city: 'Shah Alam', state: 'Selangor', lat: 3.0733, lng: 101.5185, coverage_type: 'fiber', status: 'available' },
    { city: 'Subang Jaya', state: 'Selangor', lat: 3.0570, lng: 101.5831, coverage_type: 'full', status: 'available' },
    { city: 'Cyberjaya', state: 'Selangor', lat: 2.9213, lng: 101.6559, coverage_type: 'full', status: 'available' },
    { city: 'Putrajaya', state: 'Wilayah Persekutuan', lat: 2.9264, lng: 101.6964, coverage_type: 'fiber', status: 'available' },
    { city: 'Penang', state: 'Pulau Pinang', lat: 5.4141, lng: 100.3288, coverage_type: 'fiber', status: 'available' },
    { city: 'Johor Bahru', state: 'Johor', lat: 1.4927, lng: 103.7414, coverage_type: 'fiber', status: 'available' },
    { city: 'Kota Kinabalu', state: 'Sabah', lat: 5.9804, lng: 116.0735, coverage_type: 'wireless', status: 'coming_soon' },
    { city: 'Kuching', state: 'Sarawak', lat: 1.5497, lng: 110.3626, coverage_type: 'wireless', status: 'coming_soon' }
  ]);
  console.log('Coverage areas seeded');

  console.log('\n✅ Database seeded successfully!');
  console.log('Admin: admin@balitelecommunications.com / Admin@1234');
  console.log('Client: client@example.com / Client@1234');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
