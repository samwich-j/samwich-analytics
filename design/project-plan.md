# Portfolio Website Redesign Plan

## Context
Sam wants to expand samwich-analytics.com from a single-page portfolio into a three-section site:
1. **Portfolio/Services** — existing home page, kept largely as-is
2. **Blog** — public, project write-ups accessible via a nav "Blog" button; posts written in Markdown
3. **Planner** — private, auth-protected (Google sign-in) daily scheduler based on the Scheduler repo

**Decisions made:**
- Hosting: Vercel (free tier) + Neon (free PostgreSQL)
- Blog format: Markdown files
- Auth: Sign in with Google (only Sam's Google account can access /planner)
- Calendar sync: Outlook Calendar (Microsoft Graph API) + Google Calendar API
  - No separate Notion integration needed — Google Calendar is already synced to Notion

---

## Architecture

```
samwich-analytics (single Next.js repo → deployed on Vercel)
├── /                         → Portfolio (migrated from current index.html)
├── /blog                     → Blog listing (public, SSG from markdown)
├── /blog/[slug]              → Individual posts (public, SSG from markdown)
└── /planner                  → Daily planner (private, Google OAuth protected)

API routes:
├── /api/auth/[...nextauth]   → NextAuth.js (Google OAuth)
├── /api/calendar/outlook     → Microsoft Graph API (Outlook events)
└── /api/calendar/google      → Google Calendar API (via NextAuth session token)

Database: Neon (PostgreSQL) + Prisma ORM (planner time blocks/tasks)
```

---

## Tech Stack

| Layer | Current | New |
|---|---|---|
| Framework | None (plain HTML) | Next.js 14 (App Router) |
| Styling | Custom CSS (styles.css) | Existing CSS as global stylesheet + Tailwind for new components |
| Blog | None | Markdown files + gray-matter + next-mdx-remote |
| Auth | None | NextAuth.js with Google provider |
| Planner UI | None | Adapted from Jayrod-21/Scheduler (React + TypeScript) |
| Database | None | Neon (PostgreSQL) + Prisma |
| Hosting | GitHub Pages | Vercel |

**Theme preserved:** Olive green (#778450) / gold (#d4af37), Poppins font, light/dark mode — carried over via CSS variables in the global stylesheet.

---

## Implementation Phases

### Phase 1 — Next.js Project Setup
1. Create new Next.js 14 project with TypeScript + Tailwind CSS
2. Import existing `styles.css` as a global stylesheet (preserves all portfolio styles without rewriting)
3. Migrate `index.html` content into `app/page.tsx` as a React component
4. Port `script.js` logic (theme toggle, hamburger menu, scroll-to-top) into React hooks/components
5. Copy `assets/logos/` into `public/`
6. Configure custom domain on Vercel (point samwich-analytics.com away from GitHub Pages)

### Phase 2 — Blog
1. Create `content/posts/` directory for `.md` files with frontmatter (title, date, description, tags, **draft**)
2. Build `app/blog/page.tsx` — listing page showing all posts sorted by date
   - In production: filter out posts where `draft: true`
   - In development: show all posts; render a "DRAFT" badge on draft entries
3. Build `app/blog/[slug]/page.tsx` — individual post page rendered from markdown
   - In production: return 404 for any post with `draft: true`
   - In development: render normally so you can preview the full post layout
4. Update `lib/posts.ts` to expose a `draft` field from frontmatter and apply the environment-based filter
5. Add "Blog" button to the main nav (links to `/blog`)
6. Style blog pages using existing CSS variables so they match the portfolio theme

**Draft workflow:** Add `draft: true` to a post's frontmatter to keep it hidden on the live site. Run `npm run dev` locally to preview it at its full URL. Remove the flag (or set `draft: false`) to publish.

### Phase 3 — Planner Auth
1. Install NextAuth.js, configure Google OAuth provider
2. Create `middleware.ts` — protects `/planner` route, redirects unauthenticated users to sign-in
3. Restrict access to Sam's specific Google account email via NextAuth `signIn` callback
4. Add a minimal `/login` page styled to match the site

### Phase 4 — Planner UI (adapted from Scheduler)
1. Copy Scheduler source components into `app/planner/` as a Next.js route
   - Key components: `DailyView`, `WeeklyView`, `MonthlyView`, `ClockPicker`, `BlockEditor`, `BottomNav`, `WeekStrip`
   - Key hooks: `useScheduler`, `useTimeBlocks`, `useCategories`, `useDragDrop`, `useGestures`
2. Replace Scheduler's Warm Editorial theme (cream/amber/ink) with portfolio CSS variables (olive/gold, Poppins)
3. Set up Neon database + Prisma schema (TimeBlock, TaskBlock, Category — same models as Scheduler)
4. Convert Scheduler's Express API routes to Next.js API routes under `/api/planner/`
5. Preserve all key features: analog clock picker, drag-and-drop blocks, daily/weekly/monthly views

### Phase 5 — Calendar Integrations
1. **Google Calendar**: Request `calendar.readonly` scope in Google OAuth sign-in (via NextAuth) — fetch events from Google Calendar API and display as read-only blocks in the planner timeline
2. **Outlook Calendar**: Secondary "Connect Outlook" OAuth button (Microsoft Graph API, MSAL) — store refresh token in database, fetch Outlook events on planner load
3. External calendar events rendered with a distinct visual style (different border/color) from user-created planner blocks

### Phase 6 — PWA (iPhone support)
1. Add `public/manifest.json` with app name, icons, theme color (olive green)
2. Add `next-pwa` package for service worker + offline caching
3. Add Apple-specific meta tags (`apple-mobile-web-app-capable`, status bar style)
4. Test Add to Home Screen on iPhone — full-screen experience

---

## Repo Structure

```
samwich-analytics/
├── app/
│   ├── page.tsx                        (portfolio — from index.html)
│   ├── blog/
│   │   ├── page.tsx                    (blog listing)
│   │   └── [slug]/page.tsx             (individual post)
│   ├── planner/
│   │   └── page.tsx                    (planner shell)
│   ├── login/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── calendar/google/route.ts
│       ├── calendar/outlook/route.ts
│       └── planner/[...]/route.ts
├── components/
│   ├── Nav.tsx                         (nav with Blog button)
│   ├── ThemeToggle.tsx
│   └── planner/                        (from Jayrod-21/Scheduler src/components/)
├── content/posts/                      (.md blog posts)
├── lib/
│   ├── prisma.ts
│   └── posts.ts                        (markdown parsing utilities)
├── middleware.ts                       (auth guard for /planner)
├── styles/globals.css                  (existing styles.css imported here)
├── public/
│   ├── manifest.json
│   └── assets/logos/
└── prisma/schema.prisma
```

---

## Environment Variables Needed
```
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://samwich-analytics.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ALLOWED_EMAIL=                          # Sam's Google email — only this can access /planner
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
DATABASE_URL=                           # Neon PostgreSQL connection string
```

---

## Source Repos
- Portfolio content/styles: https://github.com/samwich-j/samwich-analytics
  - Key files: `index.html`, `styles.css`, `script.js`, `assets/logos/`
- Planner components: https://github.com/Jayrod-21/Scheduler
  - Key paths: `src/components/`, `src/hooks/`, `src/types/`, `src/utils/`, `prisma/schema.prisma`

---

## Verification
- Portfolio: Visit `/`, confirm all sections render, theme toggle works, hamburger menu works on mobile
- Blog: Visit `/blog`, confirm post list shows; click a post, confirm markdown renders correctly
- Auth: Visit `/planner` signed out → redirected to login; sign in with correct Google account → access granted; wrong account → denied
- Planner: Create a time block, verify it persists after page refresh (confirms DB write)
- Calendar sync: Verify Outlook + Google Calendar events appear as read-only blocks in the timeline
- PWA: On iPhone, open site → Add to Home Screen → opens full-screen with correct icon and theme color
