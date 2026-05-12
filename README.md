# Bali Telecommunications Website

Full-stack enterprise telecom website.
Stack: Node.js + Express + Sequelize + MySQL | HTML5 + Tailwind CSS + Vanilla JS

## Quick Start

### 1. Requirements
- Node.js v18+
- MySQL 8.0+

### 2. Create Database
```sql
CREATE DATABASE balitelecom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials, JWT secret, email config
npm install
node seeders/seed.js
npm run dev
```

### 4. Visit
- Website: http://localhost:3000/pages/index.html
- Admin:   http://localhost:3000/admin/index.html
- Portal:  http://localhost:3000/pages/portal/login.html

## Default Logins
- Admin:  admin@balitelecommunications.com / Admin@1234
- Client: client@example.com / Client@1234

## Pages
- Homepage, About, Pricing, Contact, Support, Enterprise, Coverage
- Services: Fiber Internet, VoIP, Cloud Communications, Managed IT, Security Systems, Network Infrastructure
- Blog: Listing + Post detail
- Client Portal: Login, Dashboard, Invoices, Tickets
- Admin Panel: Dashboard, Leads, Tickets, Users, Invoices, Blog

## API Base: /api
Auth, Leads, Services, Plans, Blog, Coverage, Tickets, Invoices, Admin stats
