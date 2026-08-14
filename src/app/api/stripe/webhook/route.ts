import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { requireStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { sendThankYouEmail } from "@/lib/email";

export const runtime = "nodejs";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  let stripe;
  try {
    stripe = requireStripe();
  } catch {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === "paid") {
      const amountCents = session.amount_total ?? 0;
      const currency = session.currency ?? "cad";
      const donorName =
        (session.metadata?.donor_name || "").trim() ||
        session.customer_details?.name ||
        "Anonymous";
      const donorEmail = session.customer_details?.email ?? null;
      const paymentIntent =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null);

      const { error } = await admin().rpc("record_donation", {
        p_donor_name: donorName,
        p_donor_email: donorEmail,
        p_amount_cents: amountCents,
        p_currency: currency,
        p_stripe_session_id: session.id,
        p_stripe_payment_intent: paymentIntent,
        p_secret: process.env.SUPABASE_WEBHOOK_DB_SECRET!,
      });

      if (error) {
        console.error("Failed to record donation:", error);
        return NextResponse.json({ error: "DB write failed." }, { status: 500 });
      }

      if (donorEmail) {
        try {
          await sendThankYouEmail({
            to: donorEmail,
            name: donorName,
            amountCents,
            currency,
          });
        } catch (err) {
          console.error("Thank-you email failed (donation still recorded):", err);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
