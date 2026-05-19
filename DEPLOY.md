# Deploying to Hostinger (balitelecommunications.com)

## BEFORE YOU START — Buy a Hosting Plan
Your Hostinger account currently only has the domain registered.
You need a hosting plan that supports Node.js:
- Go to hpanel.hostinger.com → click "Create a website" next to balitelecommunications.com
- Choose **Business Web Hosting** or **Cloud Hosting** (both support Node.js)

---

## STEP 1 — Create MySQL Database

1. hPanel → **Databases** → **MySQL Databases**
2. Click **Create new database**
3. Fill in a database name, username, and password
4. Write these down — you need them in Step 3

---

## STEP 2 — Upload Project Files

**Option A: File Manager (easiest)**
1. hPanel → **File Manager**
2. Open the `public_html` folder
3. Upload the entire `balitelecommunications` folder here
   - You can zip it first, upload the zip, then extract it inside File Manager
   - **Do NOT upload the `backend/node_modules` folder** — install it on the server instead

**Option B: FTP with FileZilla**
1. hPanel → **FTP Accounts** → create an FTP user
2. Connect FileZilla: Host = your domain, Port = 21
3. Upload `balitelecommunications/` folder into `public_html/`

After upload, your server should look like:
```
public_html/
  balitelecommunications/
    backend/
      server.js
      package.json
      ecosystem.config.js
      ...
    frontend/
      pages/
      assets/
    admin/
```

---

## STEP 3 — Set Environment Variables

1. hPanel → **Node.js** → click your app → **Environment Variables**
2. Add each variable from `backend/.env.production`:
   - `NODE_ENV` = `production`
   - `DB_HOST` = `localhost`
   - `DB_NAME` = (from Step 1)
   - `DB_USER` = (from Step 1)
   - `DB_PASSWORD` = (from Step 1)
   - `JWT_SECRET` = (generate a strong random string, 40+ chars)
   - `FRONTEND_URL` = `https://balitelecommunications.com`
   - `MAIL_USER` = your Gmail address
   - `MAIL_PASS` = your Gmail App Password
   - `MAIL_TO` = sales@balitelecommunications.com

---

## STEP 4 — Configure Node.js App in hPanel

1. hPanel → **Node.js** → **Create Application**
2. Set these values:
   - **Node.js version**: 18.x or 20.x
   - **Application root**: `public_html/balitelecommunications/backend`
   - **Application startup file**: `server.js`
3. Click **Create**
4. Click **Run NPM Install** (this installs dependencies on the server)

---

## STEP 5 — Create Database Tables

In hPanel SSH terminal (or Node.js terminal):
```bash
cd ~/public_html/balitelecommunications/backend
node -e "require('./config/database').sequelize.sync({ force: false }).then(() => { console.log('Tables created'); process.exit(0); }).catch(e => { console.error(e); process.exit(1); })"
```

---

## STEP 6 — Enable SSL (HTTPS)

1. hPanel → **SSL** → **Install SSL Certificate**
2. Select **Let's Encrypt** (free)
3. Select your domain `balitelecommunications.com`
4. Click Install — wait 5-10 minutes

---

## STEP 7 — Verify It's Working

Open your browser and visit:
- `https://balitelecommunications.com` → should show the homepage
- `https://balitelecommunications.com/api/health` → should return `{"status":"OK",...}`
- `https://balitelecommunications.com/admin` → should show the admin panel

---

## TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| "Cannot connect to database" | Double-check DB_NAME, DB_USER, DB_PASSWORD in env vars |
| White page / 500 error | Check hPanel Node.js logs for the error message |
| API calls fail | Make sure NODE_ENV=production and app is running |
| CSS not loading | Check that `frontend/` folder was uploaded correctly |
| HTTPS not working | Wait 10 min after SSL install, then try again |
