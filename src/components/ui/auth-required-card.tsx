"use client";

import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AuthRequiredCardProps {
  title: string;
  description: string;
}

export function AuthRequiredCard({
  title,
  description,
}: AuthRequiredCardProps) {
  return (
    <Card className="border-dashed border-gray-300 bg-white">
      <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
          <LockKeyhole className="h-6 w-6 text-blue-600" />
        </div>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700">
          <ShieldCheck className="h-4 w-4" />
          PrivacyAudit account required
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
          {description}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">Create Account</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
