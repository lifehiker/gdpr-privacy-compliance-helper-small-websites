# Features — PrivacyAudit (GDPR Privacy Compliance Helper)

> Source of truth for all product features. Update whenever features are added, modified, or removed.

**App:** PrivacyAudit
**Stack:** Next.js 15 / React 19 / Prisma / NextAuth
**Target users:** Indie founders, freelancers, small agencies
**Purpose:** Run website privacy audits and track GDPR compliance fixes

---

## Landing Page

**Feature name:** Landing Page (Marketing Site)
**Description:** Public-facing marketing homepage with hero, features, how-it-works, stats, and CTA sections. Designed to communicate product value and drive signups.
**Status:** completed
**Implementation notes:**
- Sections: hero, features overview, how-it-works walkthrough, stats/social proof, call-to-action
- Statically pre-rendered for fast load and crawlability
- Links into registration and free scan flows
**Date added:** 2026-05-05

---

## Automated Website Scanner

**Feature name:** Automated Website Scanner
**Description:** Fetches a website's homepage HTML and analyzes it for GDPR-relevant signals. Produces Pass / Warning / Fail / Manual_Review findings across multiple categories. Calculates a weighted compliance score (0–100). Free plan users are limited to 1 scan per month; Pro and Agency users get unlimited scans.
**Status:** completed
**Implementation notes:**
- Fetches homepage HTML with 15-second timeout and 500KB size limit
- Detects: privacy policy link, cookie policy link, terms link, consent/cookie banner
- Analytics detection: GA4, GTM, Plausible, Fathom
- Marketing pixel detection: Meta Pixel, LinkedIn Insight Tag, TikTok Pixel
- Third-party embed detection: YouTube, Calendly, Typeform, HubSpot, Intercom
- Payment processor detection: Stripe, PayPal
- Form detection for pages collecting personal data
- Finding severity levels: Pass / Warning / Fail / Manual_Review
- Weighted compliance score calculation (0–100)
- Free plan: 1 scan/month; Pro/Agency: unlimited scans
**Date added:** 2026-05-05

---

## GDPR Compliance Checklist

**Feature name:** GDPR Compliance Checklist
**Description:** Each project gets 6 pre-seeded manual checklist items covering GDPR obligations that cannot be auto-detected by a scanner. Users track status, add inline notes, and set due dates. A progress bar shows overall completion.
**Status:** completed
**Implementation notes:**
- 6 default checklist items created automatically per project:
  1. Data retention periods documented
  2. Data processors list documented
  3. Legal basis for processing documented
  4. DSAR / contact process documented
  5. Consent logging process defined
  6. Cookie categories documented
- Status options: NOT_STARTED, IN_PROGRESS, COMPLETE, NOT_APPLICABLE
- Inline note editing per item
- Due date assignment per item
- Progress bar showing percentage complete
**Date added:** 2026-05-05

---

## Remediation Task Tracker

**Feature name:** Remediation Task Tracker
**Description:** Converts scanner findings into actionable tasks. Users can also create tasks manually. Each task tracks severity, status, owner, and due date. Tasks follow a defined status workflow and can be filtered by status. Duplicate prevention stops the same finding from generating multiple tasks.
**Status:** completed
**Implementation notes:**
- Auto-conversion of scan findings to tasks
- Task fields: title, severity (LOW/MEDIUM/HIGH/CRITICAL), status, owner, due date, notes
- Status workflow: OPEN → IN_PROGRESS → DONE / WONT_FIX
- Filter tasks by status
- Duplicate task prevention: same finding cannot create more than one task per project
**Date added:** 2026-05-05

---

## Evidence Management

**Feature name:** Evidence Management
**Description:** Users can attach evidence files to checklist items or remediation tasks to document compliance work. Files are uploaded directly from the browser to object storage via presigned URLs. Supports text notes and URL/link evidence as well.
**Status:** completed
**Implementation notes:**
- S3-based file upload via presigned URLs (direct browser-to-storage upload)
- Compatible with: AWS S3, Cloudflare R2, any S3-compatible storage
- Evidence can be attached to checklist items or tasks
- Evidence types: file upload, text note, URL/link
- Storage limits tied to plan: Pro = 2GB, Agency = 10GB
- Returns 503 gracefully if storage credentials are not configured
**Date added:** 2026-05-05

---

## PDF Report Export

**Feature name:** PDF Report Export
**Description:** Users can export a full audit report as a downloadable PDF from the project detail page. The report includes compliance score, all scan findings (with status/severity badges), the manual checklist, and all remediation tasks.
**Status:** completed
**Implementation notes:**
- @react-pdf/renderer v4 for server-side PDF generation
- PDF component in `src/lib/pdf/audit-report.tsx`
- API route: `GET /api/projects/[projectId]/export-pdf`
- Two-page A4 layout with color-coded badges and branded header
- "Export PDF" button in project detail page toolbar
- Available to all authenticated users
- Returns `application/pdf` with `Content-Disposition: attachment` for browser download
**Date added:** 2026-05-05

---

## User Authentication

**Feature name:** User Authentication
**Description:** Users register and log in with email and password. Sessions are JWT-based and managed via NextAuth credentials provider. Protected routes under `/app/*` are gated by Next.js middleware.
**Status:** completed
**Implementation notes:**
- NextAuth credentials provider with bcrypt password hashing
- JWT sessions (no database sessions)
- Prisma adapter for user persistence
- Middleware-enforced route protection on `/app/*`, redirecting unauthenticated users to login
- Welcome email sent on registration via Resend
**Date added:** 2026-05-05

---

## Project Management

**Feature name:** Project Management
**Description:** Users create projects representing a website they want to audit. Each project stores the site name, domain, region, and optional notes. Plan-based limits restrict how many projects a user can create. Projects can be deleted.
**Status:** completed
**Implementation notes:**
- Fields: site name, domain, region (EU / GLOBAL / US / UK), notes
- Create and delete support
- Plan limits enforced: FREE = 1 project, PRO = 10, AGENCY = 50
**Date added:** 2026-05-05

---

## Subscription & Billing

**Feature name:** Subscription & Billing
**Description:** Three-tier subscription model (Free, Pro, Agency) with monthly and annual billing options. Stripe Checkout handles upgrades. Stripe Billing Portal lets users manage their subscription. Webhooks keep subscription state in sync.
**Status:** completed
**Implementation notes:**
- Free tier: 1 project, 1 scan/month
- Pro tier: $19/mo or $190/yr — 10 projects, unlimited scans, PDF export, 2GB storage
- Agency tier: $59/mo or $590/yr — 50 projects, all Pro features, 10GB storage
- Stripe Checkout for plan upgrades
- Stripe Billing Portal for subscription management
- Webhook handling for full subscription lifecycle (created, updated, cancelled, etc.)
- Stripe integration is optional; requires STRIPE_SECRET_KEY environment variable
**Date added:** 2026-05-05

---

## Scan History

**Feature name:** Scan History
**Description:** Stores a complete history of all scans run for a project. Users can see how scores have changed over time and click into any historical scan to review its findings.
**Status:** completed
**Implementation notes:**
- Full scan run history per project
- Score change indicators (up/down delta vs previous scan)
- Click-through to view findings from any past scan
**Date added:** 2026-05-05

---

## Weekly Email Digest

**Feature name:** Weekly Email Digest
**Description:** A cron-triggered endpoint sends a weekly compliance digest email to users via Resend. The digest surfaces overdue tasks and scan reminders for each of the user's projects.
**Status:** completed
**Implementation notes:**
- Cron endpoint: `/api/cron/weekly-digest`
- Powered by Resend API
- Surfaces: overdue remediation tasks, scan reminders
- Welcome email also sent on new user registration
- Gracefully disabled (no errors) if RESEND_API_KEY is not configured
**Date added:** 2026-05-05

---

## Public Free Scan Tool

**Feature name:** Public Free Scan Tool
**Description:** A public-facing page at `/website-privacy-check` where anyone (no login required) can enter a URL and get a quick privacy scan result. Serves as a lead generation tool to funnel visitors into the registration flow.
**Status:** completed
**Implementation notes:**
- Route: `/website-privacy-check`
- No authentication required
- Runs the same scanner logic as the authenticated scan
- Results page prompts user to register/sign up to save and track findings
**Date added:** 2026-05-05

---

## Blog

**Feature name:** Blog
**Description:** Static blog with 5 published articles covering GDPR compliance topics. Articles are statically generated at build time for SEO performance.
**Status:** completed
**Implementation notes:**
- 5 articles on GDPR topics (cookie banners, data processors, legal basis, DSARs, etc.)
- Statically generated (SSG) at build time
- Meta title and description per article for SEO
**Date added:** 2026-05-05

---

## For Agencies Page

**Feature name:** For Agencies Page
**Description:** A dedicated B2B marketing page at `/for-agencies` targeting freelancers and agencies who manage compliance for multiple client websites. Highlights multi-project management, Agency plan features, and white-label potential.
**Status:** completed
**Implementation notes:**
- Route: `/for-agencies`
- Agency-specific positioning and benefit messaging
- Calls to action toward Agency plan signup
- Statically pre-rendered
**Date added:** 2026-05-05

---

## Privacy Policy Page

**Feature name:** Privacy Policy Page
**Description:** A proper privacy policy page at `/privacy` documenting how PrivacyAudit itself collects and processes user data. Required for legal compliance and user trust.
**Status:** completed
**Implementation notes:**
- Route: `/privacy`
- Covers: data collected, processing purposes, third-party services (Stripe, Resend, S3), user rights
- Statically rendered
**Date added:** 2026-05-05

---

## GDPR Checklist Public Page

**Feature name:** GDPR Checklist Public Page
**Description:** An educational public page at `/gdpr-checklist` providing a comprehensive GDPR compliance checklist organized into categories. Serves as an SEO content page and resource for prospective users.
**Status:** completed
**Implementation notes:**
- Route: `/gdpr-checklist`
- 17 checklist items organized into 4 categories
- No authentication required — fully public
- Statically rendered for SEO
**Date added:** 2026-05-05

---

## Pricing Page

**Feature name:** Pricing Page
**Description:** Public pricing page at `/pricing` displaying the three subscription tiers (Free, Pro, Agency) with a feature comparison table, monthly/annual toggle, and FAQ section.
**Status:** completed
**Implementation notes:**
- Route: `/pricing`
- Three-tier comparison table: Free, Pro, Agency
- Monthly/annual billing toggle
- FAQ section addressing common pricing questions
- CTAs linking to signup or Stripe Checkout
**Date added:** 2026-05-05

---

## Dashboard

**Feature name:** Dashboard
**Description:** The main authenticated home screen at `/app/dashboard` providing a summary view across all of the user's projects. Shows average compliance score, total open tasks, and a project list with per-project score and task count.
**Status:** completed
**Implementation notes:**
- Route: `/app/dashboard`
- Aggregate stats: average compliance score across all projects, total open tasks
- Project list with latest scan score and open task count per project
- Quick-access links to each project's detail view
**Date added:** 2026-05-05

---

## Responsive Sidebar Navigation

**Feature name:** Responsive Sidebar Navigation
**Description:** The authenticated app shell includes a responsive sidebar that collapses to a mobile drawer on small screens and renders as a fixed sidebar on desktop. Provides consistent navigation across all app routes.
**Status:** completed
**Implementation notes:**
- Mobile: slide-in drawer with hamburger toggle
- Desktop: fixed left sidebar
- Navigation links: Dashboard, Projects, Billing/Upgrade, Account/Settings
- Active route highlighting
- Wraps all `/app/*` routes via a shared layout component
**Date added:** 2026-05-05

---

## Compliance Score

**Feature name:** Compliance Score
**Description:** Displays a weighted 0–100 compliance score for each project based on scanner findings. Color-coded for quick interpretation. Surfaces the top priority items the user should fix first.
**Status:** completed
**Implementation notes:**
- Score range: 0–100, weighted by finding severity
- Color coding: red for <40, yellow for 40–70, green for >70
- Top priority fix items surfaced per project
**Date added:** 2026-05-05

---

## SEO Optimization

**Feature name:** SEO Optimization
**Description:** All public-facing marketing and blog pages include meta titles, descriptions, and are statically pre-rendered for fast load times and search engine crawlability.
**Status:** completed
**Implementation notes:**
- Meta title and description on all marketing and blog pages
- Static pre-rendering (SSG) for all marketing pages
- Blog articles statically generated at build time
**Date added:** 2026-05-05
