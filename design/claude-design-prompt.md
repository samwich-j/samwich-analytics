# Claude Design Brief: samwich-analytics.com

> **How to use this:** Paste this entire document into Claude Design as your opening prompt.

> **IMPORTANT — one-pass brief:** Generate everything described here in a single pass.
> Do not ask clarifying questions. Make your best judgment calls and produce all screens,
> components, states, and deliverables described below. I have limited prompts available,
> so thoroughness up front is critical.

---

## What I'm Building

I'm redesigning **samwich-analytics.com** — my personal portfolio site — from a single-page
plain HTML site into a full Next.js workspace app with three sections:

| Route | Purpose | Access |
|---|---|---|
| `/` | Portfolio & services (data analyst / developer) | Public |
| `/blog` | Project write-ups and technical posts (Markdown) | Public |
| `/planner` | Personal daily scheduler / time-blocker | Private (my Google account only) |

This is both a professional portfolio and a personal productivity workspace I'll use every day.
Long-term, the navigation and layout should feel like it *could* grow into a full personal
Notion/Obsidian-style workspace — nested pages, notes, databases — even though right now it
only needs these three sections. Design the structure to be extensible, not just for three items.

---

## Brand Identity

### Colors

```
Light mode:
  --bg:              #fcfcfc   (off-white page background)
  --bg-alt:          #ffffff   (card / elevated surface)
  --text-primary:    #555555
  --text-secondary:  #444444
  --accent:          #778450   ← olive green — the brand color
  --accent-hover:    #6a7740
  --accent-gold:     #b89c2d   (secondary accent, hover states, small highlights)
  --shadow:          rgba(100, 100, 111, 0.2) 0px 7px 29px 0px

Dark mode:
  --bg:              #36361c   (deep olive — warm, not cold black)
  --bg-alt:          #5b5a2e   (elevated surface)
  --text-primary:    #e6e6e6
  --text-secondary:  #fefefe
  --accent:          #d4af37   ← gold becomes primary accent in dark mode
  --shadow:          rgba(0, 0, 0, 0.25) 0px 7px 29px 0px
```

Light mode = clean paper with earthy ink. Dark mode = deep forest at night, warm and rich.
Both modes should feel complete and intentional — not just a color-inverted version of each other.

### Typography

- **Primary font:** Poppins (Google Fonts) — all UI, headings, body text
- **Planner only:** Fraunces (serif) for the date/time display header — editorial calendar feel
- **Scale:**
  - Display: 4rem / 600 weight (hero heading)
  - H1: 2.5rem / 600
  - H2: 1.75rem / 600
  - H3: 1.25rem / 600
  - H4: 1rem / 600
  - Body: 1rem / 400 / line-height 1.6
  - Small/caption: 0.875rem / 400
  - Label/tag: 0.75rem / 500 / letter-spacing 0.02em

### Logo

Two files in the GitHub repo **github.com/samwich-j/samwich-analytics**:
- `assets/logos/Logo-light.png` — light version, for use on dark backgrounds (dark mode)
- `assets/logos/Logo-dark.png` — dark version, for use on light backgrounds (light mode)

Logo lives top-left in the sidebar. Swap automatically with the theme.

### Brand Tone

Professional but personal. Clean and minimal, not corporate. Earthy and warm, not clinical.
A portfolio + daily productivity tool for a data analyst/developer — feels like a well-organized
personal workspace, not a generic SaaS product.

---

## Design Direction: Notion-Inspired, Olive-Powered

Borrow Notion's structure and UX patterns — but keep olive green and gold as the primary brand
colors throughout. Do NOT replace them with Notion's neutral grays.

**What to borrow from Notion:**
- Persistent left sidebar (collapsible, icon + label, workspace navigator feel)
- Content-first layouts — generous whitespace, the content is the hero not the chrome
- Block-based hierarchy — headings feel like document blocks, not web page sections
- Subtle hover states (light bg tint on sidebar items, card lift on hover)
- Minimal dividers — soft, not heavy borders
- Typography-forward: scale and weight do the work, not decorative elements

**What stays mine:**
- Olive green and gold as primary colors throughout
- Poppins as the typeface
- The warm, earthy personality

**The sidebar (desktop):**
A persistent left column (~240px wide) structured like a Notion workspace sidebar:
- Top: logo + workspace name ("samwich analytics")
- Navigation section: Home, Blog, Planner — each with an icon and label
- A visual hint that more items could be added below (workspace expand affordance)
- Active item: olive/gold accent background chip, full width
- Hover item: subtle tinted background
- Bottom: theme toggle, user avatar/name (for planner: shows signed-in Google account)

**On mobile:** Sidebar collapses entirely. A hamburger icon in a top bar toggles a slide-in
drawer. The top bar shows the logo and current page title.

---

## Section-by-Section Requirements

### 1. Portfolio — `/`

**Desktop layout:** Sidebar left, content right (max-width ~720px, centered in the content area)

**Content blocks:**
- **Hero block:** Large display heading with my name, subtitle ("Data Analyst & Developer"),
  2-sentence bio. Feels like opening a Notion document — typographic, clean, no hero image.
- **Projects block:** Heading "Projects", then 3 cards in a 2-column grid (last card spans or
  sits left-aligned). Each card: project title (H3), 1-line description, tech stack tags
  (pill-shaped, olive/gold tinted), and a subtle external link icon. Card hover: slight elevation
  shadow lift, accent border left strip.
- **Skills block:** Heading "Skills", then skill tags grouped by category. Categories:
  - Languages: Python, SQL, R, JavaScript
  - Visualization: Tableau, Power BI, Matplotlib
  - Tools: Git, dbt, Airflow, Jupyter
  - Cloud: AWS, GCP, Azure
  Each category gets a slightly different olive/gold tint so they're visually grouped.
- **Contact block:** Centered CTA — "Let's work together" heading, 1-line description, one
  olive button "Get in touch" that links to a Google Form. Clean, not pushy.

**Mobile layout:** No sidebar (drawer). Single column, full-width content, same blocks stacked.
Project cards stack to single column.

---

### 2. Blog — `/blog`

**Blog listing page:**
- **Desktop:** Sidebar + content area. Content: "Blog" H1, then a vertical list of post cards.
- **Post card:** Full-width card with title (H3), date (small muted), description (1–2 lines),
  tags (small pill chips). Hover: background tint + subtle left accent border.
- **DRAFT badge:** For draft posts (in dev only) — a small chip on the card, olive-tinted
  background with slightly muted text: "DRAFT". Makes draft posts scannable at a glance.
- No grid layout — it's a list, Notion page-list style, not a magazine.
- **Mobile:** Sidebar collapses to drawer. Post cards go full-width.

**Individual post page (`/blog/[slug]`):**
- No sidebar on the post reading view — full content width for reading focus (max ~680px centered)
- Top: breadcrumb "← Blog" back link (small, muted, olive on hover), then post title as H1,
  date + tags row beneath
- **Markdown element styles:**
  - H1–H4: Poppins, weight 600, descending scale, slight top margin
  - Body paragraph: 1rem, line-height 1.7, comfortable reading width
  - `inline code`: olive-tinted background pill, monospace font
  - Code block: dark surface (#1e1e1e even in light mode), syntax-highlighted, rounded corners,
    language label top-right, copy button top-right
  - Blockquote: left border 3px olive, tinted background, italic
  - Unordered/ordered list: standard indented with olive bullet/number color
  - Horizontal rule: thin, muted, generous vertical margin
  - Links: olive underline, gold on hover
- **Mobile:** Full-width reading, slightly tighter line length, same typography.

---

### 3. Planner — `/planner`

#### Login page (`/login`)
Shown to anyone who isn't signed in and tries to visit `/planner`.
- Centered card on a full-screen background (olive-tinted, very subtle pattern or just the
  brand background color)
- Card contains: logo, "Sign in to access your planner", "Sign in with Google" button
  (styled to match the site — olive border/text, Google "G" icon, not the default blue Google
  button), and a small "← Back to portfolio" text link below
- Both light and dark mode versions

#### Planner daily view (primary screen)
**Desktop layout:**
- Left: site sidebar (same as portfolio/blog — Home, Blog, Planner)
- Below sidebar nav, a secondary planner-specific section: Calendar, Tasks, Settings icons
- Right: planner content area
  - **Header:** current date (Fraunces font, large), day-of-week, prev/next day arrows,
    "Today" button (olive outline button), view toggle tabs (Daily / Weekly / Monthly)
  - **Time grid:** Hours from 6am to 11pm. Left column 48px wide with hour labels (12pm, 1pm…).
    Hour rows are clickable. Current time shown as a horizontal line (gold/olive) with a dot
    on the left edge. Hour height ~64px default (zoom-adjustable).
  - **Time blocks:** Positioned absolutely over the grid. Each block:
    - Rounded corners (6px)
    - Category color background (see category system below)
    - Title text (Poppins 13px, 500 weight) + time range below (11px, muted) if block is tall
      enough
    - Subtle dark border (10% opacity) for definition
    - Grab cursor; drag handle on bottom edge for resize
    - Hover: slightly elevated shadow
    - Dragging: 0.85 opacity, elevated z-index
  - **Zoom controls:** Small +/− buttons top-right of the time grid

**Mobile layout:**
- No left sidebar — replaced by a bottom navigation bar (4 tabs: Home, Calendar, Tasks, Settings)
- Top bar: hamburger (opens workspace drawer) + current date + Today button
- Time grid takes full screen width
- Time blocks same but slightly larger touch targets

#### Category color system (6 categories)
Design a harmonious palette that fits olive/gold. Each category needs a light-mode and dark-mode
chip color:
- **Work** — muted olive green (close to brand, slightly lighter: ~#a3b87a bg, #4a5c28 text)
- **Study** — sage green (#c2d4b0 bg, #3d5c2e text)
- **Personal** — warm gold/amber (#e8d5a0 bg, #7a5c10 text)
- **Health** — warm terracotta (#e8c4b0 bg, #7a3c20 text)
- **Travel** — dusty teal (#b0cece bg, #1e4a4a text)
- **Free time** — soft lavender-gray (#ccc8d8 bg, #3c3850 text)
Adjust for WCAG AA contrast. Dark mode: desaturate backgrounds slightly, lighten text.

#### Quick-create dialog
Appears when clicking on the time grid.
- Overlay with semi-transparent backdrop blur
- Card: title input ("What are you working on?" placeholder, autofocus), start/end time
  buttons (show formatted time, click to toggle analog clock picker below each), category
  selector (pill chips, olive border on selected), Cancel + "Create Block" buttons
- Clock picker: circular analog clock, olive accent hand/dot, touch-friendly
- "Create Block" disabled until title + category filled

#### Weekly view
7 columns (Mon–Sun), same time grid rows, blocks span their column. Day headers show date.
Current day column has subtle olive tint. Scrolls vertically, columns fixed.

#### Monthly view
Standard calendar grid. Days as cells. Block titles shown as small colored chips per day.
Current day has olive circle on the date number.

---

## Complete Component Inventory

Produce all of these in both light and dark mode with every relevant state:

**Navigation:**
- [ ] Sidebar expanded (desktop) — default, item hover, item active
- [ ] Sidebar collapsed / mobile drawer — open and closed states
- [ ] Top bar (mobile) — with hamburger, logo, page title
- [ ] Bottom nav bar (mobile planner) — default + active tab

**Buttons:**
- [ ] Primary (olive fill, white text) — default, hover, active, disabled, focus ring
- [ ] Secondary (olive outline) — same states
- [ ] Ghost (no border, text only) — same states
- [ ] Danger (for destructive planner actions) — same states
- [ ] Icon button (theme toggle, prev/next arrows) — default, hover, active

**Form elements:**
- [ ] Text input — default, focus (olive ring), filled, error
- [ ] Time button (planner quick-create) — default, active/toggled
- [ ] Category pill selector — unselected, selected (olive border + tint)

**Cards & blocks:**
- [ ] Project card — default, hover
- [ ] Blog post card — default, hover, with DRAFT badge
- [ ] Time block — all 6 category colors × (default, hover, dragging, resizing)
- [ ] Login card

**Planner UI:**
- [ ] Time grid (hour lines, now-indicator, zoom level visual)
- [ ] Quick-create dialog (empty, filled, with clock picker open)
- [ ] Analog clock picker
- [ ] Date navigation header
- [ ] View toggle tabs (Daily / Weekly / Monthly)
- [ ] Weekly view grid
- [ ] Monthly view grid

**Typography & content:**
- [ ] All Markdown element styles (h1–h4, p, ul, ol, blockquote, inline code, code block, hr, link)
- [ ] Skill tag — each category color variant
- [ ] DRAFT badge chip
- [ ] Breadcrumb back-link

**Global:**
- [ ] Theme toggle (sun ↔ moon icon button)
- [ ] Scroll-to-top floating button
- [ ] Focus ring style (used everywhere)
- [ ] Page-level loading skeleton (for planner)

---

## Mobile Layout Specifications

Produce explicit mobile layouts (375px viewport) for:

1. **Portfolio home (mobile):** No sidebar, top bar with hamburger, single-column content,
   project cards stacked, skills tags wrapping freely
2. **Blog listing (mobile):** Top bar, post cards full-width stacked
3. **Blog post (mobile):** Full-width reading, slightly reduced heading sizes, code blocks
   horizontally scrollable
4. **Planner daily view (mobile):** Bottom nav, full-width time grid, touch-optimized blocks
5. **Login page (mobile):** Centered card, full-screen bg, same content

---

## Technical Constraints

- **Framework:** Next.js 14 App Router — React components, TypeScript
- **Styling:** CSS custom properties for tokens; Tailwind for utilities
- **Responsive:** Mobile-first, iPhone PWA (add-to-home-screen)
- **Accessibility:** WCAG AA contrast on all text; visible focus rings; ARIA labels
- **Dark mode:** Both modes designed fully — dark bg is `#36361c`, not plain black
- **Animations:** 150–250ms, subtle. Respect `prefers-reduced-motion`.

---

## Deliverables — Produce All of These

**1. CSS design token file**
A complete `:root` and `[data-theme="dark"]` block with every custom property:
colors, typography scale, spacing scale (4px base), border-radius values, shadow definitions,
transition speeds.

**2. Global typography stylesheet**
All base element styles (h1–h4, p, a, code, blockquote, ul, ol, hr) using the token system.

**3. Component spec sheet**
For each component in the inventory above: the HTML structure, CSS class names, all variant
classes, and all state styles. Format this as annotated HTML+CSS snippets.

**4. Screen mockups**
All screens listed above, in both light and dark mode, at desktop (1280px) and mobile (375px):
- Portfolio home
- Blog listing
- Blog post (with sample markdown content rendered)
- Planner daily view (with sample time blocks across multiple categories)
- Planner weekly view
- Planner monthly view
- Login page

**5. Sidebar component detail**
Expanded and collapsed states. Show the workspace-navigator structure with the three current
items plus visual affordance that more could be added. Show how it integrates into each section.

**6. Handoff bundle**
Package all of the above into a handoff bundle ready to pass to Claude Code. Include a brief
implementation guide: which files to create first, how the token system maps to Next.js globals,
which components are shared vs. section-specific.

---

## Reference Material

- **Current live site:** samwich-analytics.com
- **Portfolio repo:** github.com/samwich-j/samwich-analytics
- **Logo files:** github.com/samwich-j/samwich-analytics/tree/main/assets/logos
- **Planner source repo:** github.com/Jayrod-21/Scheduler — key paths:
  `src/components/` (UI components), `src/hooks/` (state logic), `src/index.css` (Warm Editorial
  theme to replace), `tailwind.config.js` (existing design tokens)

Generate everything above in one pass. Start with the design token file and typography system,
then proceed through the screens in the order listed. Do not pause for feedback between sections.
