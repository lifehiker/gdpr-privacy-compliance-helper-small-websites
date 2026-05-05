import Link from "next/link";
import { Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — PrivacyAudit",
  description: "The terms that govern use of the PrivacyAudit service.",
};

export default function TermsPage() {
  const lastUpdated = "May 5, 2026";

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
              <Shield className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              PrivacyAudit
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-900">
          Terms of Service
        </h1>
        <p className="mb-10 text-sm text-slate-500">Last updated: {lastUpdated}</p>

        <div className="prose prose-slate max-w-none space-y-8 leading-relaxed text-slate-700">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">1. Agreement</h2>
            <p>
              These Terms of Service govern your use of PrivacyAudit. By creating an
              account or using the service, you agree to these terms on behalf of
              yourself or the organization you represent.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">2. Service scope</h2>
            <p>
              PrivacyAudit provides website privacy scanning, checklist management,
              remediation tracking, evidence storage, and related reporting tools.
              The service is designed to support compliance workflows, not to provide
              legal advice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">3. Your responsibilities</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Provide accurate account and billing information.</li>
              <li>Use the service only for websites you own or are authorized to audit.</li>
              <li>Review scan findings before relying on them for legal or operational decisions.</li>
              <li>Keep your credentials secure and notify us of unauthorized access.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">4. Acceptable use</h2>
            <p>You may not use PrivacyAudit to:</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Scan domains without permission.</li>
              <li>Attempt to disrupt, overload, or reverse engineer the service.</li>
              <li>Upload unlawful, infringing, or malicious content.</li>
              <li>Use the product in violation of applicable privacy or security laws.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">5. Billing</h2>
            <p>
              Paid subscriptions renew automatically unless cancelled before the next
              billing cycle. Fees are billed through Stripe. We may update plan pricing
              with reasonable notice before the change takes effect.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">6. Availability</h2>
            <p>
              We aim to keep PrivacyAudit available and reliable, but we do not
              guarantee uninterrupted service. Planned maintenance, upstream outages,
              or third-party provider failures may affect access.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">7. Disclaimers</h2>
            <p>
              PrivacyAudit is provided on an &ldquo;as is&rdquo; basis. Audit results are
              informational and cannot replace advice from qualified legal counsel or a
              formal compliance review.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">8. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, PrivacyAudit will not be liable
              for indirect, incidental, special, consequential, or punitive damages,
              or for loss of profits, revenues, data, or business opportunities arising
              from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">9. Termination</h2>
            <p>
              You may stop using the service at any time. We may suspend or terminate
              access if you materially breach these terms or use the service in a way
              that creates security, legal, or operational risk.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">10. Contact</h2>
            <p>
              Questions about these terms can be sent to{" "}
              <strong>legal@privacyaudit.app</strong>.
            </p>
          </section>
        </div>
      </main>

      <footer className="mt-10 border-t border-slate-800 bg-slate-950 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500">
              <Shield className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-white">PrivacyAudit</span>
          </Link>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/pricing" className="text-slate-400 transition-colors hover:text-white">
              Pricing
            </Link>
            <Link href="/gdpr-checklist" className="text-slate-400 transition-colors hover:text-white">
              GDPR Checklist
            </Link>
            <Link href="/blog" className="text-slate-400 transition-colors hover:text-white">
              Blog
            </Link>
            <Link href="/privacy" className="text-slate-400 transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-400 transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
