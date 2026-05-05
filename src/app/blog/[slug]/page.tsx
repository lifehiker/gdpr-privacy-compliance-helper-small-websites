import Link from "next/link";
import { Shield, ArrowLeft, ArrowRight, Clock, ChevronRight } from "lucide-react";

type PostMeta = {
  title: string;
  excerpt: string;
  readTime: string;
  tag: string;
  date: string;
  content: string[];
};

const posts: Record<string, PostMeta> = {
  "gdpr-checklist-startup-websites": {
    title: "GDPR Checklist for Startup Websites",
    excerpt:
      "Launching a startup? Here's the complete GDPR checklist to get right before you go live — from privacy policies to data retention schedules.",
    readTime: "6 min read",
    tag: "GDPR Basics",
    date: "April 28, 2025",
    content: [
      "Launching a startup is already overwhelming. Privacy compliance often gets pushed to 'later' — but if you're targeting European users or collecting any personal data, GDPR obligations apply from day one.",
      "The good news: getting the basics right is achievable in a weekend. Here's the checklist.",
      "## 1. Write and publish a privacy policy",
      "Your privacy policy must explain: what personal data you collect, why you collect it (the legal basis), how long you keep it, and who you share it with. It must be written in plain, accessible language — not legalese.",
      "Minimum coverage: name and contact details of your business, types of data collected (email, IP, usage data, etc.), purposes of processing, legal basis for each purpose, retention periods, user rights, and how to contact you for a DSAR.",
      "## 2. Add a cookie consent mechanism",
      "If your site uses any non-essential cookies (analytics, advertising, A/B testing tools), you need explicit consent before setting them. A cookie banner that fires on first visit, allows users to accept or decline categories, and stores that preference is the minimum requirement.",
      "Essential cookies (session cookies, login state) don't require consent. Everything else does.",
      "## 3. Document your data processing activities",
      "Keep a simple register of: what personal data you collect, where it's stored (which tools/services), who can access it, and how long you keep it. This is called a Record of Processing Activities (ROPA).",
      "## 4. Identify your legal basis for each activity",
      "Every data processing activity needs a documented legal basis under GDPR. Common ones for startups: Consent (email marketing), Contract (fulfilling orders, providing the service), Legitimate interests (fraud prevention, analytics).",
      "## 5. Set up a way to handle DSARs",
      "Data Subject Access Requests must be fulfilled within 30 days. Create a dedicated email address (e.g. privacy@yourcompany.com) and document your internal process for handling requests.",
      "## 6. Use a cookie scanner before launch",
      "Before going live, scan your site to identify every third-party script and cookie it drops. You may have more than you realise — analytics, support widgets, font loaders, A/B testing tools all touch personal data.",
      "PrivacyAudit can automate this scan and map findings directly to your compliance checklist.",
    ],
  },
  "what-small-websites-need-for-privacy-compliance": {
    title: "What Small Websites Need for Privacy Compliance",
    excerpt:
      "You don't need a legal team to get privacy right. Here's a practical breakdown of what small website owners actually need to cover GDPR requirements.",
    readTime: "5 min read",
    tag: "Small Websites",
    date: "April 20, 2025",
    content: [
      "GDPR has a reputation for complexity. But for small websites, the actual requirements are narrower than most people assume. You don't need a legal team or a dedicated DPO.",
      "Here's what you actually need.",
      "## A privacy policy (required)",
      "Non-negotiable. If your website collects any personal data — even just an email address for a newsletter — you need a privacy policy. It must explain what you collect, why, and how users can exercise their rights.",
      "## A cookie consent banner (if you use non-essential cookies)",
      "If you're using Google Analytics, any advertising pixels, or third-party embeds (YouTube, Intercom, Hotjar) — you need a consent banner. Essential cookies like login sessions don't count.",
      "## HTTPS everywhere",
      "Your site must be served over HTTPS. This protects data in transit and is a basic security requirement under GDPR's requirement for 'appropriate technical measures'.",
      "## A way for users to exercise their rights",
      "At minimum: an email address or contact form where users can request access to their data, ask for deletion, or withdraw consent. You must respond within 30 days.",
      "## What you probably don't need (yet)",
      "A full-time DPO. That's required only for organisations that process personal data at scale, or process sensitive categories of data. For most small websites, a named internal contact suffices.",
      "Formal DPIAs (Data Protection Impact Assessments) are only required for high-risk processing activities. Standard website analytics doesn't qualify.",
      "## The fastest way to know if you're compliant",
      "Run a privacy audit against your site. Tools like PrivacyAudit can scan your website and surface missing requirements — policy links, cookie configurations, and third-party trackers — in under two minutes.",
    ],
  },
  "how-to-audit-consent-banners-and-policy-links": {
    title: "How to Audit Consent Banners and Policy Links",
    excerpt:
      "Cookie consent banners and privacy policy links are among the most commonly misconfigured privacy elements. Learn how to audit them effectively.",
    readTime: "7 min read",
    tag: "Technical",
    date: "April 14, 2025",
    content: [
      "Consent banners and privacy policy links are the two most visible privacy controls on any website — and the two most commonly misconfigured. Regulators have issued significant fines for both.",
      "Here's how to audit each one thoroughly.",
      "## Auditing your privacy policy link",
      "Step 1: Check visibility. Your privacy policy must be easily findable. Best practice: link in the footer of every page, in your cookie notice, in any sign-up forms, and in any marketing emails.",
      "Step 2: Check the link actually works. Broken privacy policy links are common and are a clear signal to regulators of negligence.",
      "Step 3: Check the policy is current. If your policy still refers to tools you no longer use, or doesn't mention tools you've added, it's out of date. Review and update whenever your data processing changes.",
      "## Auditing your cookie consent banner",
      "A compliant consent banner must: appear before any non-essential cookies are set, allow users to accept or decline each category, make declining as easy as accepting, and remember the user's preference.",
      "Step 1: Clear your browser cookies and visit your site in an incognito window. Does the banner appear immediately on first visit, before any scripts have fired?",
      "Step 2: Check that declining is possible. Regulators (particularly CNIL and the ICO) have specifically cracked down on banners where 'Decline' is hard to find or requires more clicks than 'Accept'.",
      "Step 3: Test that consent is respected. After declining, use your browser's developer tools (Application tab) to verify that non-essential cookies haven't been set.",
      "Step 4: Check your analytics. If you're running Google Analytics, verify it's not firing for users who have declined. This often requires Consent Mode v2 configuration.",
      "## Common failure patterns",
      "Pre-ticked boxes: consent must be active, not passive. Pre-ticked boxes don't constitute valid consent.",
      "Soft opt-out: a banner that says 'We use cookies' with only an 'OK' button is not compliant — there's no way to decline.",
      "Consent without granularity: bundling analytics and advertising into a single 'Accept' is not compliant if users can't accept one and decline the other.",
      "## The automated approach",
      "Manually checking all of the above on multiple pages is time-consuming. PrivacyAudit automates this by scanning your site, identifying all cookies and scripts that fire, and flagging those that appear before consent is registered.",
    ],
  },
  "privacy-compliance-checklist-ecommerce": {
    title: "Privacy Compliance Checklist for Ecommerce Stores",
    excerpt:
      "Ecommerce sites handle sensitive customer data at every step of the checkout funnel. This checklist covers every GDPR touchpoint specific to online stores.",
    readTime: "8 min read",
    tag: "Ecommerce",
    date: "April 7, 2025",
    content: [
      "Ecommerce stores face a higher GDPR surface area than most websites. You're handling payment data, shipping addresses, purchase history, browsing behaviour, and often remarketing pixels across all of it.",
      "Here's the complete checklist.",
      "## Checkout and payment processing",
      "Never store raw card data yourself. Payment processors like Stripe and Paddle handle this, but you must have a Data Processing Agreement with them and reference them in your privacy policy.",
      "Shipping addresses count as personal data. Document how long you retain them (typically needed for 7 years for tax records) and who you share them with (couriers, fulfilment centres).",
      "## Marketing and remarketing",
      "Meta Pixel, Google Ads, TikTok Pixel, and similar tools drop cookies before a user has consented by default. You must implement Consent Mode or conditional loading to ensure these only fire after consent.",
      "If you run email marketing: you need a clear opt-in at sign-up, a record of when that consent was given, and an easy way to unsubscribe from every email.",
      "## Product reviews and user accounts",
      "User accounts store personal data indefinitely by default. Set a data retention policy — e.g. delete inactive accounts after 3 years of inactivity, with advance notice to the user.",
      "If you use review platforms (Trustpilot, Yotpo), check their DPAs and include them in your processor list.",
      "## Abandoned cart recovery",
      "Abandoned cart emails are a common conversion tool, but using an email address collected during checkout for marketing requires a legal basis. If the user didn't complete the purchase, consent may not have been given.",
      "Use legitimate interests carefully here — document your balancing test.",
      "## Customer support data",
      "Support tickets, live chat transcripts, and help desk data all contain personal information. Document your retention period and ensure your support tool has a DPA.",
      "## The compliance audit",
      "Use PrivacyAudit to scan your ecommerce site and identify which tracking scripts and cookies are present, which fire without consent, and which policy links are missing or broken. The dashboard maps every finding to a specific remediation task.",
    ],
  },
  "agency-workflow-for-website-privacy-audits": {
    title: "Agency Workflow for Website Privacy Audits",
    excerpt:
      "Managing privacy compliance for multiple clients is complex. This workflow shows how agencies can systematise audits, reporting, and remediation tracking.",
    readTime: "6 min read",
    tag: "For Agencies",
    date: "March 31, 2025",
    content: [
      "As an agency, privacy compliance is both an obligation and an opportunity. Every client website you build or maintain is potentially in scope for GDPR. Having a repeatable workflow saves time and protects you from liability.",
      "Here's the workflow we recommend.",
      "## Step 1: Onboard every client into a shared audit system",
      "The first thing to solve is visibility. Using separate spreadsheets per client doesn't scale. Set up a single compliance management tool where each client has their own project, with their own scan history, findings, and task list.",
      "PrivacyAudit's Agency plan lets you manage up to 50 client projects from a single dashboard.",
      "## Step 2: Run baseline scans on all clients",
      "Once clients are onboarded, run a baseline scan on every site. This gives you an immediate picture of where each client stands — what's missing, what's misconfigured, and what risk severity each finding carries.",
      "Sort clients by risk level. Focus remediation effort on the highest-risk ones first.",
      "## Step 3: Build a remediation task list per client",
      "Convert each scan finding into a concrete task. Assign severity (critical, high, medium, low), a due date, and if relevant — a team member to handle it.",
      "Add evidence capture to each task: screenshots of the cookie banner, confirmation of DPAs signed, updated privacy policy drafts.",
      "## Step 4: Generate a compliance report",
      "At the end of an audit cycle, generate a PDF report for your client. It should show: what was found, what's been remediated, and what's still outstanding.",
      "This serves as both a client deliverable and an audit trail for the agency. If a client is later investigated by a regulator, you have documented evidence of due diligence.",
      "## Step 5: Schedule re-scans",
      "Compliance isn't a one-time project. Every time a client changes their website — adds a new analytics tool, builds a new landing page, integrates a new service — the compliance status may change.",
      "Set a schedule to re-scan client sites monthly or after any significant release.",
      "## The business case for agencies",
      "Formalising privacy compliance as a service is a high-value recurring revenue opportunity. Clients often don't know where to start and appreciate having it handled. An Agency plan at $59/month across even 10 clients is easy to justify as a line item in a monthly retainer.",
    ],
  },
};

const tagColors: Record<string, string> = {
  "GDPR Basics": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Small Websites": "bg-blue-50 text-blue-700 border-blue-200",
  "Technical": "bg-violet-50 text-violet-700 border-violet-200",
  "Ecommerce": "bg-amber-50 text-amber-700 border-amber-200",
  "For Agencies": "bg-slate-100 text-slate-700 border-slate-200",
};

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">PrivacyAudit</span>
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 mb-4">Article not found.</p>
            <Link href="/blog" className="text-emerald-600 hover:underline font-medium text-sm">
              ← Back to blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── NAV ─────────────────────────────────────────────────────────── */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">PrivacyAudit</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
            <Link href="/register" className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Start Free</Link>
          </div>
        </div>
      </header>

      {/* ─── ARTICLE HEADER ──────────────────────────────────────────────── */}
      <section className="bg-slate-900 pb-14 pt-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="relative max-w-3xl mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All articles
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tagColors[post.tag] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
              {post.tag}
            </span>
            <span className="flex items-center gap-1 text-slate-400 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="text-slate-500 text-xs">{post.date}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-snug tracking-tight mb-4">
            {post.title}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">{post.excerpt}</p>
        </div>
      </section>

      {/* ─── ARTICLE BODY ────────────────────────────────────────────────── */}
      <article className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          {/* Inline CTA */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-emerald-900 font-semibold text-sm">Automate this with PrivacyAudit</p>
              <p className="text-emerald-700 text-xs mt-0.5">Run an automated scan and get a compliance checklist tailored to your website.</p>
            </div>
            <Link
              href="/register"
              className="flex-shrink-0 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              Start free
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Rendered content */}
          <div className="prose-custom space-y-5">
            {post.content.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-xl font-bold text-slate-900 mt-10 mb-3 pt-6 border-t border-slate-100"
                  >
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              return (
                <p key={i} className="text-slate-600 leading-relaxed text-base">
                  {block}
                </p>
              );
            })}
          </div>
        </div>
      </article>

      {/* ─── MORE ARTICLES ───────────────────────────────────────────────── */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">More from the blog</h2>
          <div className="space-y-3">
            {Object.entries(posts)
              .filter(([s]) => s !== slug)
              .slice(0, 3)
              .map(([s, p]) => (
                <Link
                  key={s}
                  href={`/blog/${s}`}
                  className="group flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl px-5 py-4 hover:shadow-sm hover:border-slate-300 transition-all"
                >
                  <div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border mr-2 ${tagColors[p.tag] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {p.tag}
                    </span>
                    <span className="text-slate-900 font-medium text-sm group-hover:text-emerald-700 transition-colors">{p.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 group-hover:text-emerald-500 transition-colors" />
                </Link>
              ))}
          </div>
          <div className="mt-4">
            <Link href="/blog" className="text-emerald-600 hover:underline text-sm font-medium inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              View all articles
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to audit your website?</h2>
          <p className="text-slate-400 mb-6 text-sm">Free plan available. First scan in under 2 minutes.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] text-sm"
          >
            Start free audit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return [
    { slug: "gdpr-checklist-startup-websites" },
    { slug: "what-small-websites-need-for-privacy-compliance" },
    { slug: "how-to-audit-consent-banners-and-policy-links" },
    { slug: "privacy-compliance-checklist-ecommerce" },
    { slug: "agency-workflow-for-website-privacy-audits" },
  ];
}

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold">PrivacyAudit</span>
        </Link>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm justify-center">
          <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/for-agencies" className="text-slate-400 hover:text-white transition-colors">For Agencies</Link>
          <Link href="/gdpr-checklist" className="text-slate-400 hover:text-white transition-colors">GDPR Checklist</Link>
          <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link>
          <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
