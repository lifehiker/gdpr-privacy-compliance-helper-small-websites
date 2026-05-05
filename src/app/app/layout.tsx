import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "./_components/sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        userName={session.user.name}
        userEmail={session.user.email}
      />

      {/* Main content area — offset for desktop sidebar, top bar on mobile */}
      <div className="lg:pl-56">
        <main className="pt-14 lg:pt-0 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
