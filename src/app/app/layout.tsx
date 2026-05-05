import Link from "next/link";
import { auth } from "@/auth";
import { Sidebar } from "./_components/sidebar";
import { ShieldCheck } from "lucide-react";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated ? (
        <Sidebar
          userName={session.user?.name}
          userEmail={session.user?.email}
        />
      ) : (
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2 text-gray-900">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold">PrivacyAudit</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Create Account
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* Main content area — offset for desktop sidebar, top bar on mobile */}
      <div className={isAuthenticated ? "lg:pl-56" : undefined}>
        <main className={isAuthenticated ? "min-h-screen pt-14 lg:pt-0" : "min-h-screen"}>
          {children}
        </main>
      </div>
    </div>
  );
}
