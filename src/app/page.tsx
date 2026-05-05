import Link from "next/link";
import {
  Shield,
  Search,
  ClipboardList,
  Wrench,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Globe,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── NAV ─────────────────────────────────────────────────────────── */}
      <header className="bg-slate-900 sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              PrivacyAudit
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Features
            </a>
            <Link
              href="/pricing"
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/for-agencies"
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              For Agencies
            </Link>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 pb-24 pt-20 relative overflow-hidden">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            GDPR Compliance for Small Websites
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
            Privacy compliance
            <br />
            <span className="text-emerald-400">made simple</span> for
            <br />
            small websites
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Run a fast website privacy audit, detect missing policy links and
            trackers, and track GDPR fixes in one dashboard. Built for indie
            founders, freelancers, and agencies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]"
            >
              Start free audit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
            >
              See how it works
            </a>
          </div>

          {/* Trust strip */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-500 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              No credit card required
            </span>
            <span className="hidden sm:block text-slate-700">|</span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Free plan available
            </span>
            <span className="hidden sm:block text-slate-700">|</span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              First scan in under 2 minutes
            </span>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM BANNER ──────────────────────────────────────────────── */}
      <section className="bg-amber-50 border-y border-amber-200 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-slate-800 font-semibold text-lg">
                Most small websites miss at least 3 privacy requirements.
              </p>
              <p className="text-slate-600 mt-1">
                Know exactly what to fix first - before regulators or users
                notice.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-8 md:ml-auto">
              <Stat label="Privacy policy missing" value="1 in 3" />
              <Stat label="Consent banner absent" value="~60%" />
              <Stat label="Unmasked trackers" value="Most sites" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-widest mb-3">
              What you get
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Everything you need to stay compliant
            </h2>
            <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">
              Purpose-built tools for founders and agencies who need clarity,
              not complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="w-6 h-6 text-emerald-600" />}
              iconBg="bg-emerald-50 border-emerald-100"
              title="Automated Site Scanner"
              description="Detects privacy policy links, cookie banners, analytics trackers, marketing pixels, and third-party scripts automatically - no manual digging required."
              highlights={[
                "Cookie & consent banner detection",
                "Analytics & pixel identification",
                "Third-party script mapping",
              ]}
            />
            <FeatureCard
              icon={<ClipboardList className="w-6 h-6 text-blue-600" />}
              iconBg="bg-blue-50 border-blue-100"
              title="Privacy Compliance Checklist"
              description="Guided checklist covering data retention, legal basis, DSAR process, consent logging, and cookie categories - the full GDPR surface area."
              highlights={[
                "Data retention policies",
                "Legal basis documentation",
                "DSAR & consent logging",
              ]}
            />
            <FeatureCard
              icon={<Wrench className="w-6 h-6 text-violet-600" />}
              iconBg="bg-violet-50 border-violet-100"
              title="Remediation Tracker"
              description="Convert scan findings into actionable tasks with severity levels, due dates, and evidence capture. Know what's fixed and what's still outstanding."
              highlights={[
                "Severity-ranked task list",
                "Due dates & assignments",
                "Evidence file capture",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Compliance in three steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Step
              number="01"
              title="Add your website"
              description="Enter your domain. PrivacyAudit takes it from there - no code installs needed."
            />
            <Step
              number="02"
              title="Run the scan"
              description="Our scanner crawls your site and surfaces exactly what's missing or misconfigured."
            />
            <Step
              number="03"
              title="Fix what's missing"
              description="Follow the prioritised task list to resolve findings. Mark items done as you go."
            />
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #10b981 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Start your free privacy audit today
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Join founders and agencies who use PrivacyAudit to stay ahead of
            GDPR requirements without the legal overhead.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-10 py-4 rounded-xl text-base transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
          >
            Get started for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-slate-600 text-sm mt-4">
            No credit card | Free forever plan available
          </p>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-white font-semibold">PrivacyAudit</span>
              </Link>
              <p className="text-slate-500 text-sm max-w-xs">
                Fast privacy audit + fix tracker for small websites.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center md:justify-end text-sm">
              <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
              <Link href="/for-agencies" className="text-slate-400 hover:text-white transition-colors">For Agencies</Link>
              <Link href="/gdpr-checklist" className="text-slate-400 hover:text-white transition-colors">GDPR Checklist</Link>
              <Link href="/website-privacy-check" className="text-slate-400 hover:text-white transition-colors">Website Privacy Check</Link>
              <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link>
              <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">
              (c) {new Date().getFullYear()} PrivacyAudit. All rights reserved.
            </p>
            <p className="text-slate-600 text-xs flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Built for GDPR compliance in the EU & UK
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  iconBg,
  title,
  description,
  highlights,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  highlights: string[];
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-slate-300 transition-all group">
      <div
        className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${iconBg}`}
      >
        {icon}
      </div>
      <h3 className="text-slate-900 font-semibold text-xl mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-5">
        {description}
      </p>
      <ul className="space-y-2">
        {highlights.map((h) => (
          <li key={h} className="flex items-center gap-2 text-sm text-slate-600">
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="text-6xl font-black text-slate-100 select-none leading-none mb-4">
        {number}
      </div>
      <h3 className="text-slate-900 font-semibold text-xl mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
