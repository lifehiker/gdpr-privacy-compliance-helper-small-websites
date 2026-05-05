import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    // Graceful no-op if Stripe is not configured
    return NextResponse.json({ received: true });
  }

  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId ?? session.client_reference_id;
      if (!userId) break;

      const stripeCustomerId = typeof session.customer === "string" ? session.customer : null;
      const stripeSubscriptionId = typeof session.subscription === "string" ? session.subscription : null;
      const plan = (session.metadata?.plan as string) ?? "PRO";

      // Retrieve subscription to get period end
      let currentPeriodEnd: Date | null = null;
      if (stripeSubscriptionId) {
        const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        currentPeriodEnd = new Date((stripeSub as { current_period_end: number }).current_period_end * 1000);
      }

      await db.subscription.upsert({
        where: { userId },
        update: {
          stripeCustomerId,
          stripeSubscriptionId,
          plan,
          status: "active",
          currentPeriodEnd,
        },
        create: {
          userId,
          stripeCustomerId,
          stripeSubscriptionId,
          plan,
          status: "active",
          currentPeriodEnd,
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object;
      const stripeSubscriptionId = sub.id;

      const subscription = await db.subscription.findFirst({
        where: { stripeSubscriptionId },
      });
      if (!subscription) break;

      await db.subscription.update({
        where: { id: subscription.id },
        data: {
          status: sub.status,
          currentPeriodEnd: new Date((sub as { current_period_end: number }).current_period_end * 1000),
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const stripeSubscriptionId = sub.id;

      const subscription = await db.subscription.findFirst({
        where: { stripeSubscriptionId },
      });
      if (!subscription) break;

      await db.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "canceled",
          plan: "FREE",
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
