import Link from "next/link";
import { Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — PrivacyAudit",
  description: "How PrivacyAudit collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "May 5, 2025";

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
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

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: {lastUpdated}</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Who we are</h2>
            <p>
              PrivacyAudit (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) provides a GDPR compliance toolset for small
              websites, freelancers, and agencies. We are the data controller for information
              collected through this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">2. What data we collect</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Account data:</strong> your name, email address, and hashed password when you register.</li>
              <li><strong>Project data:</strong> domain names and notes you add for websites you track.</li>
              <li><strong>Scan data:</strong> HTML snippets and findings from automated scans of your listed websites.</li>
              <li><strong>Usage data:</strong> standard server logs (IP address, browser, pages visited) for security and debugging.</li>
              <li><strong>Payment data:</strong> if you subscribe, payment is handled entirely by Stripe — we never store card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">3. How we use your data</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To operate and improve the PrivacyAudit service.</li>
              <li>To send account and subscription-related emails (e.g. receipts, weekly digests).</li>
              <li>To detect abuse and enforce our terms of service.</li>
            </ul>
            <p className="mt-3">We do not sell your data or share it with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Legal basis (GDPR)</h2>
            <p>We process your data under the following legal bases:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><strong>Contract:</strong> processing necessary to provide the service you signed up for.</li>
              <li><strong>Legitimate interests:</strong> security logging and fraud prevention.</li>
              <li><strong>Consent:</strong> optional marketing emails (you may opt out at any time).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Data retention</h2>
            <p>
              We retain your account data for as long as your account is active. Scan data is
              retained for 12 months and then automatically deleted. You may request deletion
              of your account and all associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Your rights</h2>
            <p>Under GDPR and UK GDPR you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Access the personal data we hold about you.</li>
              <li>Correct inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Object to or restrict certain processing.</li>
              <li>Data portability — receive your data in a structured format.</li>
              <li>Lodge a complaint with your local supervisory authority (e.g. ICO in the UK).</li>
            </ul>
            <p className="mt-3">To exercise any right, contact us at the address below.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Cookies</h2>
            <p>
              We use a single session cookie required for authentication. We do not use
              advertising or tracking cookies. No third-party analytics scripts are loaded on
              this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Third-party services</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Stripe</strong> — payment processing. See <a href="https://stripe.com/privacy" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">Stripe&apos;s privacy policy</a>.</li>
              <li><strong>Resend</strong> — transactional email delivery. See <a href="https://resend.com/privacy" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">Resend&apos;s privacy policy</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Contact</h2>
            <p>
              For privacy enquiries or data subject requests, please contact us at{" "}
              <strong>privacy@privacyaudit.app</strong>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-10 mt-10">
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
            <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link>
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
