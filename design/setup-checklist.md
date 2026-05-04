# Setup Checklist — Before Development Starts

Complete these steps before any code is written. Each section links to where you do the setup.

---

## 1. Vercel Account
- [ ] Create account at vercel.com (free — sign up with GitHub)
- [ ] Connect your GitHub account to Vercel
- [ ] Note: Do NOT create a project yet — we will do that when the repo is ready

---

## 2. Neon Database (PostgreSQL)
- [ ] Create account at neon.tech (free — sign up with GitHub or Google)
- [ ] Create a new project (name it "samwich-analytics" or similar)
- [ ] Create a database inside the project
- [ ] Copy the connection string — it looks like:
      postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
- [ ] Save it as: DATABASE_URL

---

## 3. Google OAuth (for Planner sign-in + Google Calendar)
- [ ] Go to console.cloud.google.com
- [ ] Create a new project (name it "samwich-analytics")
- [ ] Enable these two APIs (Library → search and enable each):
      - Google Calendar API
      - Google+ API (or "Google Identity" / People API)
- [ ] Go to Credentials → Create Credentials → OAuth 2.0 Client ID
      - Application type: Web application
      - Authorized redirect URIs: http://localhost:3000/api/auth/callback/google
        (add https://samwich-analytics.com/api/auth/callback/google when deployed)
- [ ] Copy:
      - Client ID → save as: GOOGLE_CLIENT_ID
      - Client Secret → save as: GOOGLE_CLIENT_SECRET
- [ ] Go to OAuth consent screen → add your email as a test user

---

## 4. Microsoft Azure (for Outlook Calendar)
- [ ] Go to portal.azure.com (sign in with your UVU Microsoft account or personal account —
      whichever Outlook calendar you want to sync)
- [ ] Go to Azure Active Directory → App Registrations → New Registration
      - Name: samwich-analytics-planner
      - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
      - Redirect URI: http://localhost:3000/api/calendar/outlook/callback
        (add https://samwich-analytics.com/api/calendar/outlook/callback when deployed)
- [ ] After creating, go to Certificates & Secrets → New client secret
      - Copy the secret value immediately (it only shows once)
- [ ] Copy:
      - Application (client) ID → save as: MICROSOFT_CLIENT_ID
      - Client Secret value → save as: MICROSOFT_CLIENT_SECRET
- [ ] Go to API Permissions → Add a Permission → Microsoft Graph → Delegated:
      - Calendars.Read
      - offline_access (for refresh tokens)

---

## 5. GitHub Repo Setup
- [ ] Create a new GitHub repo called "samwich-analytics" (or rename/repurpose the existing one)
      - This will REPLACE the current GitHub Pages repo
      - Option A: Rename the existing repo and wipe the contents (we will rebuild from scratch)
      - Option B: Create a brand new repo and archive the old one
- [ ] Clone the Scheduler repo locally so we can copy components from it:
      git clone https://github.com/Jayrod-21/Scheduler.git

---

## 6. Vercel Domain Transfer
- [ ] Once the new repo is deployed on Vercel, go to Vercel → Project → Settings → Domains
- [ ] Add samwich-analytics.com
- [ ] Update DNS records at your domain registrar:
      - Remove the old GitHub Pages A records
      - Add Vercel's nameservers or A/CNAME records (Vercel will show you exactly what to add)
- [ ] Note: There may be a brief DNS propagation window (up to 24 hours) where the site redirects

---

## 7. Environment Variables File
Once all of the above are done, create a file called .env.local in the project root with:

NEXTAUTH_SECRET=          # generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=         # from step 3
GOOGLE_CLIENT_SECRET=     # from step 3
ALLOWED_EMAIL=            # your Google account email (the only one that can access /planner)
MICROSOFT_CLIENT_ID=      # from step 4
MICROSOFT_CLIENT_SECRET=  # from step 4
DATABASE_URL=             # from step 2

DO NOT commit this file to GitHub. It is already in .gitignore by default in Next.js projects.

When deploying to Vercel, add these same variables in:
Vercel → Project → Settings → Environment Variables

---

## Summary Order
1. Neon (database) — 5 min
2. Google Cloud Console (OAuth + Calendar) — 15 min
3. Azure Portal (Outlook Calendar) — 15 min
4. Vercel account — 5 min
5. GitHub repo decisions — your call
6. Fill in .env.local — 5 min once all above are done
