# Samwich Analytics

Personal portfolio site for Sam Johnston — Data Analyst & Statistical Consultant.

Built with Next.js 14 (App Router), TypeScript, and a custom design token system from Claude Design.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Auth:** NextAuth.js (passphrase-based)
- **Database:** Neon PostgreSQL + Prisma (Phase 2)
- **Blog:** Markdown via gray-matter + next-mdx-remote
- **Styling:** CSS custom properties (design tokens) + Tailwind utilities

## Routes

| Route | Access |
|-------|--------|
| `/` | Portfolio home |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post |
| `/resume` | Résumé |
| `/planner` | Auth-gated |
| `/notes` | Auth-gated |
| `/login` | Sign in |

## Development

```bash
npm install
npm run dev
```

Create `.env.local` with:

```
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
ADMIN_PASSPHRASE=...
DATABASE_URL=...
```

## Adding Blog Posts

Create `.md` files in `content/posts/` with frontmatter:

```md
---
title: "Post Title"
date: "2026-01-01"
description: "One line summary"
tags: ["tag1", "tag2"]
draft: false
---

Content here.
```

Draft posts are visible in development but hidden in production.
