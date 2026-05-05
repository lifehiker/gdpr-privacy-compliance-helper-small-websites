"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { ArrowRight, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Register the account
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Registration failed. Please try again.");
        return;
      }

      // Step 2: Sign in with the new credentials
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Account created but sign-in failed. Please sign in manually.");
        router.push("/login");
      } else {
        toast.success("Account created! Welcome to PrivacyAudit.");
        router.push("/app/dashboard");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_32%),linear-gradient(to_bottom,rgba(15,23,42,0.15),rgba(2,6,23,0.92))]" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="hidden max-w-xl lg:block">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
              GDPR-ready workflow
            </div>
            <h1 className="max-w-lg text-5xl font-bold tracking-[-0.05em] text-white">
              Launch a privacy workspace that feels built for client delivery.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Create projects, scan live websites, track fixes by severity, and
              keep every evidence file attached to the right audit trail.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                One dashboard for scans, checklist items, and overdue fixes.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Export-ready documentation for founders, freelancers, and agencies.
              </div>
            </div>
          </div>

          <div>
            <div className="mb-8 flex items-center justify-center gap-2.5 lg:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-[0_18px_42px_rgba(16,185,129,0.28)]">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-white">
                PrivacyAudit
              </span>
            </div>

            <Card className="w-full max-w-md border-white/10 bg-white/95 shadow-[0_40px_100px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-bold text-slate-950">
                  Create your account
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Start auditing your website&apos;s privacy compliance in minutes
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="font-medium text-slate-700">
                      Full name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jane Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      disabled={loading}
                      required
                      className="h-11 border-slate-200 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="font-medium text-slate-700">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      disabled={loading}
                      required
                      className="h-11 border-slate-200 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="font-medium text-slate-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={loading}
                      required
                      minLength={6}
                      className="h-11 border-slate-200 bg-white"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-2">
                  <Button
                    type="submit"
                    className="h-11 w-full bg-emerald-500 text-base font-semibold text-white hover:bg-emerald-400"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account…
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-emerald-600 transition-colors hover:text-emerald-500 hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>

            <p className="mt-6 max-w-md text-center text-xs text-slate-400 lg:text-left">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-white">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
