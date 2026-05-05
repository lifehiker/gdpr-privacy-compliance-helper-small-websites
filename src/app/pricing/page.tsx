import Link from "next/link";
import { Shield, Check, ArrowRight, Zap, Building2, ChevronDown } from "lucide-react";

export default function PricingPage() {
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
      <section className="bg-slate-900 pb-16 pt-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="relative max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-slate-400 text-lg">
            Start free. Upgrade as you grow. No hidden fees.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5" />
            Annual billing saves ~2 months (17% off)
          </div>
        </div>
      </section>

      {/* ─── PRICING CARDS ───────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 items-start">

            {/* Free */}
            <PricingCard
              name="Free"
              price="$0"
              period="/month"
              description="Perfect for checking your own website and learning what's needed."
              cta="Get started free"
              ctaHref="/register"
              highlighted={false}
              features={[
                "1 project",
                "1 scan per month",
                "Basic compliance checklist",
                "3 evidence file uploads",
                "Email support",
              ]}
            />

            {/* Pro */}
            <PricingCard
              name="Pro"
              price="$19"
              period="/month"
              description="Everything you need to stay compliant across multiple projects."
              cta="Start Pro free trial"
              ctaHref="/register?plan=pro"
              highlighted={true}
              badge="Most Popular"
              features={[
                "10 projects",
                "Unlimited scans",
                "Full checklist + task tracking",
                "PDF report export",
                "2 GB evidence storage",
                "Full audit history",
                "Priority email support",
              ]}
            />

            {/* Agency */}
            <PricingCard
              name="Agency"
              price="$59"
              period="/month"
              description="Handle client audits at scale with branded exports and bulk management."
              cta="Start Agency trial"
              ctaHref="/register?plan=agency"
              highlighted={false}
              icon={<Building2 className="w-4 h-4" />}
              features={[
                "50 projects",
                "All Pro features",
                "Branded PDF export",
                "10 GB evidence storage",
                "Bulk scan management",
                "Client-ready reports",
                "Priority support + onboarding",
              ]}
            />
          </div>

          <p className="text-center text-slate-500 text-sm mt-8">
            All plans include a 14-day free trial. No credit card required to start.
          </p>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight text-center mb-12">
            Full comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left text-slate-500 font-medium py-3 pb-4 w-1/2">Feature</th>
                  <th className="text-center text-slate-600 font-semibold py-3 pb-4">Free</th>
                  <th className="text-center text-emerald-700 font-semibold py-3 pb-4 bg-emerald-50 rounded-t-lg">Pro</th>
                  <th className="text-center text-slate-600 font-semibold py-3 pb-4">Agency</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Projects", "1", "10", "50"],
                  ["Scans / month", "1", "Unlimited", "Unlimited"],
                  ["Checklist items", "Basic", "Full", "Full"],
                  ["Task tracking", "—", "✓", "✓"],
                  ["PDF export", "—", "✓", "Branded"],
                  ["Evidence storage", "3 files", "2 GB", "10 GB"],
                  ["Audit history", "—", "✓", "✓"],
                  ["Bulk scan management", "—", "—", "✓"],
                  ["Branded reports", "—", "—", "✓"],
                  ["Support", "Email", "Priority email", "Priority + onboarding"],
                ].map(([feature, free, pro, agency]) => (
                  <tr key={feature} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-3 text-slate-700 font-medium">{feature}</td>
                    <td className="py-3 text-center text-slate-500">{free}</td>
                    <td className="py-3 text-center text-slate-700 bg-emerald-50/50 font-medium">{pro}</td>
                    <td className="py-3 text-center text-slate-500">{agency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            <FaqItem
              question="Can I upgrade or downgrade at any time?"
              answer="Yes. You can change plans at any time from your account settings. If you upgrade, you're billed the prorated difference immediately. Downgrades take effect at the next billing cycle."
            />
            <FaqItem
              question="What does a 'scan' count as?"
              answer="One scan is one full crawl of a single website. On the Free plan, you get one scan per month per project. Pro and Agency plans include unlimited scans across all your projects."
            />
            <FaqItem
              question="Does PrivacyAudit cover UK GDPR as well?"
              answer="Yes. The checklist and scanner rules cover both EU GDPR and UK GDPR requirements, including ICO guidance. The core requirements are largely the same."
            />
            <FaqItem
              question="Is there a discount for annual billing?"
              answer="Yes — annual billing saves you the equivalent of roughly 2 months (about 17% off). You can switch to annual billing in your account settings at any time."
            />
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-slate-400 mb-8">Free plan available. No credit card required.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]"
          >
            Start your free audit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  ctaHref,
  highlighted,
  badge,
  icon,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  badge?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`relative rounded-2xl p-8 ${
        highlighted
          ? "bg-slate-900 text-white ring-2 ring-emerald-500 shadow-2xl"
          : "bg-white border border-slate-200 shadow-sm"
      }`}
    >
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
          {badge}
        </div>
      )}
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className={highlighted ? "text-emerald-400" : "text-slate-400"}>{icon}</span>}
        <h3 className={`font-semibold text-lg ${highlighted ? "text-white" : "text-slate-900"}`}>{name}</h3>
      </div>
      <div className="flex items-end gap-1 mt-4 mb-2">
        <span className={`text-5xl font-black tracking-tight ${highlighted ? "text-white" : "text-slate-900"}`}>{price}</span>
        <span className={`text-sm mb-2 ${highlighted ? "text-slate-400" : "text-slate-500"}`}>{period}</span>
      </div>
      <p className={`text-sm mb-6 leading-relaxed ${highlighted ? "text-slate-400" : "text-slate-500"}`}>{description}</p>
      <Link
        href={ctaHref}
        className={`block text-center font-semibold py-3 px-6 rounded-xl text-sm transition-all mb-8 ${
          highlighted
            ? "bg-emerald-500 hover:bg-emerald-400 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            : "bg-slate-900 hover:bg-slate-700 text-white"
        }`}
      >
        {cta}
      </Link>
      <ul className="space-y-3">
        {features.map((f) => (
          <li key={f} className={`flex items-start gap-2.5 text-sm ${highlighted ? "text-slate-300" : "text-slate-600"}`}>
            <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${highlighted ? "text-emerald-400" : "text-emerald-500"}`} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-slate-900 font-semibold">{question}</h3>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
      </div>
      <p className="text-slate-500 text-sm mt-3 leading-relaxed">{answer}</p>
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
          <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link>
          <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
