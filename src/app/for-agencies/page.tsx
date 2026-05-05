import Link from "next/link";
import {
  Shield,
  ArrowRight,
  Layers,
  FileText,
  Users,
  Check,
  BarChart3,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function ForAgenciesPage() {
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
      <section className="bg-slate-900 pb-20 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
              <Users className="w-3.5 h-3.5" />
              For Agencies
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-6">
              Audit client websites
              <br />
              <span className="text-emerald-400">at scale</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              Manage privacy compliance for all your clients in one place. Run
              automated scans, generate branded PDF reports, and track every
              remediation task — without juggling spreadsheets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register?plan=agency"
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]"
              >
                Start free agency trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
              >
                See pricing
              </Link>
            </div>
            <div className="mt-6 text-slate-600 text-sm">
              Agency plan · $59/mo · Up to 50 client projects · 14-day free trial
            </div>
          </div>
        </div>
      </section>

      {/* ─── PAIN POINTS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-amber-50 border-y border-amber-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              The agency privacy compliance problem
            </h2>
            <p className="text-slate-600 mt-3 max-w-xl mx-auto">
              You&apos;re managing dozens of clients, each with different website
              setups — and GDPR compliance is too easy to overlook.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
                title: "Liability exposure",
                body: "Clients who build on your recommendations expect compliance guidance. Missed requirements can put both parties at risk.",
              },
              {
                icon: <Clock className="w-5 h-5 text-amber-600" />,
                title: "Manual reviews are slow",
                body: "Checking each client site by hand for cookie banners, policy links, and script inventory is tedious, error-prone, and doesn't scale.",
              },
              {
                icon: <FileText className="w-5 h-5 text-amber-600" />,
                title: "No paper trail",
                body: "When a client asks for proof of compliance or a regulator comes knocking, you need documented evidence — not a vague email thread.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-amber-200 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-slate-900 font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-widest mb-3">Agency workflow</p>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              From client onboard to signed-off report
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: <Layers className="w-5 h-5 text-emerald-600" />,
                title: "Add client sites",
                body: "Create a project per client domain. Organise by client name, industry, or risk level.",
              },
              {
                step: "02",
                icon: <BarChart3 className="w-5 h-5 text-emerald-600" />,
                title: "Run automated scans",
                body: "Kick off scans across all projects. Results arrive in seconds — cookie banners, policy links, trackers, scripts.",
              },
              {
                step: "03",
                icon: <Check className="w-5 h-5 text-emerald-600" />,
                title: "Build remediation tasks",
                body: "Convert findings into a prioritised task list. Assign severity, due dates, and evidence uploads.",
              },
              {
                step: "04",
                icon: <FileText className="w-5 h-5 text-emerald-600" />,
                title: "Export branded reports",
                body: "Generate a PDF report with your agency branding. Share with clients as a deliverable or retain as audit evidence.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-5xl font-black text-slate-100 leading-none mb-4 select-none">{item.step}</div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-slate-900 font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AGENCY FEATURES ─────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Built specifically for agency work
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              ["Up to 50 client projects", "Scale without per-seat friction"],
              ["Branded PDF export", "Reports carry your agency name and logo"],
              ["10 GB evidence storage", "Capture screenshots, files, and consent logs per project"],
              ["Unlimited scans", "Re-scan after every update — no artificial limits"],
              ["Full audit history", "See every scan result over time for trend analysis"],
              ["Priority support + onboarding", "Get set up fast and get answers when you need them"],
            ].map(([title, detail]) => (
              <div key={title} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-slate-900 font-semibold text-sm">{title}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING HIGHLIGHT ───────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
            One plan for the whole agency
          </h2>
          <p className="text-slate-500 mb-10">
            The Agency plan is $59/month for up to 50 projects. No per-seat pricing.
            No per-client add-ons.
          </p>
          <div className="bg-slate-900 rounded-2xl p-10 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Agency Plan
              </div>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-6xl font-black text-white">$59</span>
                <span className="text-slate-400 mb-2">/month</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {[
                  "50 projects",
                  "Unlimited scans",
                  "Branded PDF reports",
                  "10 GB storage",
                  "Priority support + onboarding",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-slate-300 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register?plan=agency"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]"
              >
                Start 14-day free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-slate-500 text-xs mt-3">No credit card required to start</p>
            </div>
          </div>
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
          <Link href="/gdpr-checklist" className="text-slate-400 hover:text-white transition-colors">GDPR Checklist</Link>
          <Link href="/website-privacy-check" className="text-slate-400 hover:text-white transition-colors">Privacy Check</Link>
          <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link>
          <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
