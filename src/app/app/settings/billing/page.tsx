import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, CreditCard } from "lucide-react";
import { UpgradeButton } from "../_components/upgrade-button";

const PLANS = [
  {
    key: "FREE",
    name: "Free",
    price: 0,
    description: "Perfect for trying out PrivacyAudit on a single site.",
    features: [
      "1 project",
      "Automated privacy scan",
      "GDPR compliance checklist",
      "Task management",
    ],
    cta: "Current plan",
    highlighted: false,
  },
  {
    key: "PRO",
    name: "Pro",
    price: 19,
    description: "For freelancers and small teams managing multiple websites.",
    features: [
      "Up to 10 projects",
      "Automated privacy scans",
      "GDPR + CCPA checklists",
      "Evidence upload",
      "PDF compliance reports",
      "Email reminders",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    key: "AGENCY",
    name: "Agency",
    price: 59,
    description: "For agencies managing compliance for many clients.",
    features: [
      "Up to 50 projects",
      "Everything in Pro",
      "White-label PDF reports",
      "Priority support",
      "Bulk scan scheduling",
    ],
    cta: "Upgrade to Agency",
    highlighted: false,
  },
] as const;

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const currentPlan = subscription?.plan ?? "FREE";
  const currentPlanData = PLANS.find((p) => p.key === currentPlan) ?? PLANS[0];

  const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;

  const priceIds: Record<string, string | undefined> = {
    PRO: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    AGENCY: process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing &amp; Plan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your subscription and upgrade your plan.
        </p>
      </div>

      {/* Current plan summary */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 text-base">
                    {currentPlanData.name} Plan
                  </p>
                  <Badge
                    variant={currentPlan === "FREE" ? "secondary" : "default"}
                    className="text-xs"
                  >
                    {currentPlan === "FREE" ? "Free" : "Active"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {currentPlan === "FREE"
                    ? "You are on the free plan — upgrade to unlock more projects and features."
                    : `Your ${currentPlanData.name} subscription is active.`}
                </p>
              </div>
            </div>
            {currentPlan !== "FREE" && (
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  ${currentPlanData.price}
                  <span className="text-sm font-normal text-gray-500">/mo</span>
                </p>
                {subscription?.currentPeriodEnd && (
                  <p className="text-xs text-gray-400 mt-1">
                    Renews{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(subscription.currentPeriodEnd))}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stripe notice if not configured */}
      {!isStripeConfigured && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Developer note:</strong> Billing is managed via Stripe. Configure{" "}
          <code className="font-mono bg-amber-100 rounded px-1 text-xs">STRIPE_SECRET_KEY</code>{" "}
          in your environment to enable payments.
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = plan.key === currentPlan;
          const isDowngrade =
            (currentPlan === "AGENCY" && plan.key !== "AGENCY") ||
            (currentPlan === "PRO" && plan.key === "FREE");

          return (
            <Card
              key={plan.key}
              className={
                plan.highlighted
                  ? "border-blue-500 ring-1 ring-blue-500 relative"
                  : "relative"
              }
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white shadow">
                    <Zap className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">{plan.name}</CardTitle>
                  {isCurrent && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <div className="mt-1">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-sm text-gray-500">/mo</span>
                </div>
                <CardDescription className="text-xs leading-relaxed mt-1">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : isDowngrade ? (
                  <Button variant="ghost" className="w-full text-gray-500" disabled>
                    Downgrade
                  </Button>
                ) : (
                  <UpgradeButton
                    planKey={plan.key}
                    planName={plan.name}
                    isHighlighted={plan.highlighted}
                    isStripeConfigured={isStripeConfigured}
                    priceId={priceIds[plan.key]}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="mt-6 text-xs text-gray-400 text-center">
        All plans are billed monthly. Cancel anytime. Prices in USD.
      </p>
    </div>
  );
}
