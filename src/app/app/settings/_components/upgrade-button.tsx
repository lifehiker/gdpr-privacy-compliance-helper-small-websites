"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UpgradeButtonProps {
  planKey: string;
  planName: string;
  isHighlighted: boolean;
  isStripeConfigured: boolean;
  priceId?: string;
}

export function UpgradeButton({
  planKey,
  planName,
  isHighlighted,
  isStripeConfigured,
  priceId,
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!isStripeConfigured) return;
    if (!priceId) {
      toast.error("Price ID not configured. Add the Stripe price ID to your environment.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, plan: planKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to start checkout.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      className="w-full gap-2"
      variant={isHighlighted ? "default" : "outline"}
      disabled={!isStripeConfigured || loading}
      onClick={handleClick}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : planKey === "AGENCY" ? (
        <Building2 className="h-4 w-4" />
      ) : (
        <Zap className="h-4 w-4" />
      )}
      {loading ? "Redirecting..." : `Upgrade to ${planName}`}
    </Button>
  );
}
