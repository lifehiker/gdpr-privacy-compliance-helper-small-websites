import Link from "next/link";
import { Shield, ArrowRight, Clock, ChevronRight } from "lucide-react";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  tag: string;
  date: string;
};

const posts: BlogPost[] = [
  {
    slug: "gdpr-checklist-startup-websites",
    title: "GDPR Checklist for Startup Websites",
    excerpt:
      "Launching a startup? Here's the complete GDPR checklist to get right before you go live — from privacy policies to data retention schedules.",
    readTime: "6 min read",
    tag: "GDPR Basics",
    date: "April 28, 2025",
  },
  {
    slug: "what-small-websites-need-for-privacy-compliance",
    title: "What Small Websites Need for Privacy Compliance",
    excerpt:
      "You don't need a legal team to get privacy right. Here's a practical breakdown of what small website owners actually need to cover GDPR requirements.",
    readTime: "5 min read",
    tag: "Small Websites",
    date: "April 20, 2025",
  },
  {
    slug: "how-to-audit-consent-banners-and-policy-links",
    title: "How to Audit Consent Banners and Policy Links",
    excerpt:
      "Cookie consent banners and privacy policy links are among the most commonly misconfigured privacy elements. Learn how to audit them effectively.",
    readTime: "7 min read",
    tag: "Technical",
    date: "April 14, 2025",
  },
  {
    slug: "privacy-compliance-checklist-ecommerce",
    title: "Privacy Compliance Checklist for Ecommerce Stores",
    excerpt:
      "Ecommerce sites handle sensitive customer data at every step of the checkout funnel. This checklist covers every GDPR touchpoint specific to online stores.",
    readTime: "8 min read",
    tag: "Ecommerce",
    date: "April 7, 2025",
  },
  {
    slug: "agency-workflow-for-website-privacy-audits",
    title: "Agency Workflow for Website Privacy Audits",
    excerpt:
      "Managing privacy compliance for multiple clients is complex. This workflow shows how agencies can systematise audits, reporting, and remediation tracking.",
    readTime: "6 min read",
    tag: "For Agencies",
    date: "March 31, 2025",
  },
];

const tagColors: Record<string, string> = {
  "GDPR Basics": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Small Websites": "bg-blue-50 text-blue-700 border-blue-200",
  "Technical": "bg-violet-50 text-violet-700 border-violet-200",
  "Ecommerce": "bg-amber-50 text-amber-700 border-amber-200",
  "For Agencies": "bg-slate-100 text-slate-700 border-slate-200",
};

export default function BlogPage() {
  const [featured, ...rest] = posts;

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
      <section className="bg-slate-900 pb-14 pt-14 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Blog</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              GDPR & Privacy Compliance Resources
            </h1>
            <p className="text-slate-400 text-lg">
              Practical guides for indie founders, freelancers, and agencies
              navigating website privacy requirements.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FEATURED POST ───────────────────────────────────────────────── */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <Link
            href={`/blog/${featured.slug}`}
            className="group block bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tagColors[featured.tag] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                    {featured.tag}
                  </span>
                  <span className="text-slate-400 text-xs">Featured</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-4">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featured.readTime}
                  </span>
                  <span>{featured.date}</span>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center self-center md:self-auto">
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold group-hover:gap-2 transition-all">
                  Read article
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── POST LIST ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-xl font-bold text-slate-900 mb-8">All articles</h2>
          <div className="space-y-4">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-start gap-5 bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${tagColors[post.tag] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {post.tag}
                    </span>
                  </div>
                  <h3 className="text-slate-900 font-semibold text-lg mb-1.5 group-hover:text-emerald-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                    <span>{post.date}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0 mt-1 group-hover:text-emerald-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to audit your website?
          </h2>
          <p className="text-slate-400 mb-6 text-sm">
            Stop reading about compliance and start doing it. Free plan available.
          </p>
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
          <Link href="/website-privacy-check" className="text-slate-400 hover:text-white transition-colors">Privacy Check</Link>
          <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
