import { NextResponse } from "next/server";
import { requireStripe } from "@/lib/stripe";
import { MIN_DONATION, MAX_DONATION, SITE } from "@/lib/config";

export const runtime = "nodejs";

function siteUrl(req: Request) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(req.url).origin
  ).replace(/\/$/, "");
}

export async function POST(req: Request) {
  let stripe;
  try {
    stripe = requireStripe();
  } catch {
    return NextResponse.json(
      { error: "Donations aren't available yet — Stripe isn't configured." },
      { status: 503 },
    );
  }

  let body: { amount?: number; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount < MIN_DONATION || amount > MAX_DONATION) {
    return NextResponse.json(
      { error: `Please enter an amount between $${MIN_DONATION} and $${MAX_DONATION}.` },
      { status: 400 },
    );
  }

  const name = (body.name || "").toString().slice(0, 120).trim();
  const base = siteUrl(req);
  const amountCents = Math.round(amount * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    submit_type: "donate",
    line_items: [
      {
        price_data: {
          currency: "cad",
          product_data: {
            name: "Donation to Full Plate YYC",
            description: "One-time gift — every $1 becomes 3× in food.",
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    metadata: { donor_name: name },
    success_url: `${base}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/?donation=cancelled#donate`,
  });

  return NextResponse.json({ url: session.url });
}
