# Samwich Analytics Portfolio Website

Next.js 14 portfolio site deployed on Vercel. Features blog (MDX), auth-gated planner/notes, and project showcase.

## Tech Stack

- Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- NextAuth v4 (passphrase-based)
- Prisma + Neon PostgreSQL
- Blog: gray-matter + next-mdx-remote

## Key Paths

- `app/` — Next.js app router pages
- `components/` — React components
- `content/posts/` — published blog posts (MDX)
- `content/drafts/` — blog draft content and research
- `lib/` — utilities and config
- `design/` — design docs and setup checklist

## Running

```bash
npm install
npm run dev
```

## Deployment

Auto-deploys via Vercel GitHub integration on push to main. No vercel.json — config is in the Vercel dashboard. Domain: samwich-analytics.com.

## Important

- `.env.local` has secrets (NEXTAUTH_SECRET, DATABASE_URL, ADMIN_PASSPHRASE) — never commit
- Old GitHub Pages files have been removed (migrated to Vercel)
