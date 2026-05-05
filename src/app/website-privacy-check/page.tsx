"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield, Search, Check, ArrowRight, Globe, Lock, FileText, Cookie } from "lucide-react";

export default function WebsitePrivacyCheckPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a website URL.");
      return;
    }
    // Basic URL validation
    try {
      const normalized =
        trimmed.startsWith("http://") || trimmed.startsWith("https://")
          ? trimmed
          : `https://${trimmed}`;
      new URL(normalized);
      router.push(`/register?url=${encodeURIComponent(normalized)}`);
    } catch {
      setError("Please enter a valid URL, e.g. https://yoursite.com");
    }
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

      {/* ─── HERO + FORM ─────────────────────────────────────────────────── */}
      <section className="bg-slate-900 pb-20 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Free Tool
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-4">
            Free Website Privacy Check
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
            Enter your website URL and get an instant privacy audit — detecting
            missing policy links, cookie banners, and third-party trackers.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 pl-10 pr-4 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  aria-label="Website URL"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-7 py-4 rounded-xl text-sm transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] whitespace-nowrap"
              >
                Check Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {error && (
              <p className="text-amber-400 text-xs mt-2 text-left">{error}</p>
            )}
            <p className="text-slate-600 text-xs mt-3">
              A free account is required to view results. No credit card needed.
            </p>
          </form>
        </div>
      </section>

      {/* ─── WHAT WE CHECK ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-widest mb-3">What gets checked</p>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Instant results across 4 key areas
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FileText className="w-6 h-6 text-emerald-600" />,
                bg: "bg-emerald-50 border-emerald-100",
                title: "Privacy Policy",
                body: "Detects whether a privacy policy link is present and accessible from your homepage.",
              },
              {
                icon: <Cookie className="w-6 h-6 text-blue-600" />,
                bg: "bg-blue-50 border-blue-100",
                title: "Cookie Banner",
                body: "Checks for a functional cookie consent mechanism on page load.",
              },
              {
                icon: <Search className="w-6 h-6 text-violet-600" />,
                bg: "bg-violet-50 border-violet-100",
                title: "Analytics Trackers",
                body: "Identifies Google Analytics, Meta Pixel, and other tracking scripts.",
              },
              {
                icon: <Lock className="w-6 h-6 text-slate-600" />,
                bg: "bg-slate-50 border-slate-200",
                title: "Third-Party Scripts",
                body: "Maps external scripts loaded by your site that may involve data sharing.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${item.bg}`}>
                  {item.icon}
                </div>
                <h3 className="text-slate-900 font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BENEFITS ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "No code or tracking pixel to install",
              "Results in under 2 minutes",
              "Plain-English explanations of each finding",
              "Prioritised by risk — know what to fix first",
              "Full audit history saved to your account",
              "Free plan available — no credit card needed",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-slate-700 text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want the full compliance dashboard?
          </h2>
          <p className="text-slate-400 mb-8">
            The free check is just the start. Sign up for full access to the
            checklist, task tracker, and evidence capture.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]"
          >
            Create free account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-slate-600 text-sm mt-4">Free plan available · No credit card required</p>
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
          <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link>
          <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
