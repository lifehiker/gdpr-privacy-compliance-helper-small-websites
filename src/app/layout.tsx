import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "PrivacyAudit — Website Privacy Check and GDPR Checklist",
  description: "Run a fast website privacy audit, detect missing policy links and trackers, and track GDPR fixes in one simple dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
