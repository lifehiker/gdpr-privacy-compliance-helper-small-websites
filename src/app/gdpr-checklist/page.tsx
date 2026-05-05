import Link from "next/link";
import { Shield, CheckCircle2, XCircle, ArrowRight, Lock, FileText, Users, Settings } from "lucide-react";

type ChecklistItem = {
  id: string;
  label: string;
  detail: string;
  example?: string;
};

type Category = {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: ChecklistItem[];
};

const categories: Category[] = [
  {
    title: "Technical Requirements",
    icon: <Settings className="w-5 h-5 text-emerald-600" />,
    color: "emerald",
    items: [
      {
        id: "privacy-policy",
        label: "Privacy policy page exists and is linked",
        detail: "Your site must have an accessible privacy policy explaining what data you collect, why, and how it's used.",
        example: "Link in footer, cookie notice, and account sign-up flow.",
      },
      {
        id: "cookie-banner",
        label: "Cookie consent banner is present",
        detail: "Visitors must be able to accept or reject non-essential cookies before they are set.",
        example: "A banner appearing on first visit with Accept / Decline / Manage options.",
      },
      {
        id: "ssl",
        label: "HTTPS / SSL certificate enabled",
        detail: "All pages must be served over HTTPS to protect data in transit.",
        example: "Valid TLS certificate, no mixed content warnings.",
      },
      {
        id: "forms-notice",
        label: "Data collection notices on forms",
        detail: "Every form that collects personal data (email signups, contact, checkout) must inform users what you'll do with their data.",
        example: "\"By submitting this form, you agree to our Privacy Policy.\"",
      },
      {
        id: "opt-out",
        label: "Marketing opt-out mechanism",
        detail: "Users who receive marketing communications must be able to unsubscribe easily.",
        example: "Unsubscribe link in every email, preference centre in account settings.",
      },
    ],
  },
  {
    title: "Documentation Requirements",
    icon: <FileText className="w-5 h-5 text-blue-600" />,
    color: "blue",
    items: [
      {
        id: "data-inventory",
        label: "Data inventory / processing register",
        detail: "You must document every type of personal data you collect, its source, how it's used, and how long you retain it.",
        example: "A spreadsheet or tool listing: email addresses, IP logs, purchase history — each with retention period.",
      },
      {
        id: "legal-basis",
        label: "Legal basis identified for each processing activity",
        detail: "Each data processing activity must have a documented legal basis: consent, contract, legitimate interest, legal obligation, vital interests, or public task.",
        example: "Email marketing = consent; order fulfilment = contract; fraud prevention = legitimate interest.",
      },
      {
        id: "data-processors",
        label: "Processor agreements in place",
        detail: "Any third-party service that processes personal data on your behalf (email tools, hosting, analytics) must have a Data Processing Agreement (DPA) with you.",
        example: "DPAs signed with Stripe, Mailchimp, AWS, etc.",
      },
      {
        id: "retention-policy",
        label: "Data retention policy documented",
        detail: "You must specify how long you keep personal data and have a process to delete it when no longer needed.",
        example: "Customer data retained for 7 years for tax purposes; website logs deleted after 30 days.",
      },
      {
        id: "transfers",
        label: "International data transfer safeguards",
        detail: "If you send personal data outside the UK/EU (e.g. using US-based SaaS tools), you need appropriate safeguards in place.",
        example: "Standard Contractual Clauses (SCCs) or adequacy decisions.",
      },
    ],
  },
  {
    title: "Process Requirements",
    icon: <Users className="w-5 h-5 text-violet-600" />,
    color: "violet",
    items: [
      {
        id: "dsar",
        label: "Data Subject Access Request (DSAR) process",
        detail: "You must have a way for individuals to request access to, correction of, or deletion of their personal data — and respond within 30 days.",
        example: "A dedicated email address or form for privacy requests.",
      },
      {
        id: "consent-logging",
        label: "Consent logged with timestamp",
        detail: "Where you rely on consent as your legal basis, you must be able to prove that consent was given, when, and for what purpose.",
        example: "Storing consent timestamp and form version in your database.",
      },
      {
        id: "breach-process",
        label: "Data breach response process",
        detail: "You must have a documented plan for detecting, containing, and reporting data breaches. Breaches affecting individual rights must be reported to the ICO/supervisory authority within 72 hours.",
        example: "An internal runbook for incident response, with contact details for your DPA.",
      },
      {
        id: "privacy-by-design",
        label: "Privacy by design applied to new features",
        detail: "New products and features that involve personal data should consider privacy implications from the outset, not as an afterthought.",
        example: "DPIAs conducted for high-risk processing activities.",
      },
    ],
  },
  {
    title: "Cookie & Tracker Management",
    icon: <Lock className="w-5 h-5 text-slate-600" />,
    color: "slate",
    items: [
      {
        id: "cookie-categories",
        label: "Cookies categorised by type",
        detail: "Your cookie notice must clearly distinguish between essential cookies (no consent needed) and non-essential cookies (analytics, marketing — require consent).",
        example: "Essential / Analytics / Marketing / Preferences categories in your cookie banner.",
      },
      {
        id: "analytics-consent",
        label: "Analytics only loaded after consent",
        detail: "Google Analytics, Meta Pixel, and similar tools must not set cookies or collect data before the user has actively consented.",
        example: "Conditional script loading based on consent state.",
      },
      {
        id: "cookie-policy",
        label: "Cookie policy lists all cookies used",
        detail: "A detailed cookie policy (can be part of your privacy policy) must list every cookie, its purpose, and its expiry.",
        example: "A table of cookie name, provider, purpose, expiry for every cookie set.",
      },
    ],
  },
];

export default function GdprChecklistPage() {
  const totalItems = categories.reduce((acc, c) => acc + c.items.length, 0);

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

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 pb-16 pt-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Free Resource
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            GDPR Compliance Checklist<br />for Small Websites
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {totalItems} requirements across technical, documentation, process, and cookie categories.
            Check each one off — or use PrivacyAudit to automate the process.
          </p>
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-black text-white">{totalItems}</div>
              <div className="text-slate-500 text-xs mt-0.5">Total requirements</div>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl font-black text-white">{categories.length}</div>
              <div className="text-slate-500 text-xs mt-0.5">Categories</div>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-400">Free</div>
              <div className="text-slate-500 text-xs mt-0.5">To use</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LEGEND ──────────────────────────────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-200 py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-6 text-sm text-slate-500">
          <span className="font-medium text-slate-600">Legend:</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Pass
          </span>
          <span className="flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-red-400" /> Fail / Missing
          </span>
          <span className="ml-auto text-xs">
            Use PrivacyAudit to check these automatically →{" "}
            <Link href="/register" className="text-emerald-600 hover:underline font-medium">Get started free</Link>
          </span>
        </div>
      </div>

      {/* ─── CHECKLIST ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {categories.map((cat) => (
            <div key={cat.title}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border
                  ${cat.color === "emerald" ? "bg-emerald-50 border-emerald-100" : ""}
                  ${cat.color === "blue" ? "bg-blue-50 border-blue-100" : ""}
                  ${cat.color === "violet" ? "bg-violet-50 border-violet-100" : ""}
                  ${cat.color === "slate" ? "bg-slate-50 border-slate-200" : ""}
                `}>
                  {cat.icon}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{cat.title}</h2>
                <span className="ml-auto text-xs text-slate-400 font-medium">{cat.items.length} items</span>
              </div>

              <div className="space-y-4">
                {cat.items.map((item, idx) => (
                  <ChecklistRow key={item.id} item={item} index={idx + 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Automate this checklist with PrivacyAudit
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Instead of checking manually, let PrivacyAudit scan your website and
            map every finding to items on this list — then guide you through fixing them.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]"
          >
            Start free audit
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-slate-600 text-sm mt-4">Free plan available · No credit card required</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── ChecklistRow ─────────────────────────────────────────────────────────── */

function ChecklistRow({ item, index }: { item: ChecklistItem; index: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow group">
      <div className="flex items-start gap-4">
        {/* Pass/fail indicators (decorative — showing both states for reference) */}
        <div className="flex gap-1 flex-shrink-0 mt-0.5">
          <div
            className="w-7 h-7 rounded-full border-2 border-slate-200 flex items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors group/check"
            title="Mark as passing"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-300 group-hover/check:text-emerald-500 transition-colors" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-slate-900 font-semibold text-sm leading-snug">
              <span className="text-slate-400 font-normal mr-2">{String(index).padStart(2, "0")}</span>
              {item.label}
            </h3>
          </div>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{item.detail}</p>
          {item.example && (
            <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <span className="text-slate-400 text-xs font-medium">Example: </span>
              <span className="text-slate-600 text-xs">{item.example}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
          <Link href="/website-privacy-check" className="text-slate-400 hover:text-white transition-colors">Privacy Check</Link>
          <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link>
          <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
