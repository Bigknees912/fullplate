import Link from "next/link";
import { PlateMark } from "@/components/nav";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

function money(cents: number, currency = "cad") {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let amountLine: string | null = null;
  let name: string | null = null;
  if (session_id && stripe) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id);
      if (s.amount_total) amountLine = money(s.amount_total, s.currency ?? "cad");
      name = s.metadata?.donor_name || s.customer_details?.name || null;
    } catch {
      // ignore — still show a friendly confirmation
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f1e8] px-6 py-20">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8622a] to-[#f59331] text-white shadow-[0_16px_40px_rgba(232,98,42,0.35)]">
          <PlateMark className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-[#1c1512]">
          Thank you{name ? `, ${name.split(" ")[0]}` : ""}! 🧡
        </h1>
        <p className="mt-4 text-lg text-[#5a4d40] leading-relaxed">
          {amountLine ? (
            <>
              Your gift of <strong>{amountLine}</strong> just became{" "}
              <strong className="text-[#e8622a]">
                {amountLine.replace(/[\d.,]+/, (m) =>
                  (parseFloat(m.replace(/,/g, "")) * 3).toLocaleString("en-CA", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
                )}
              </strong>{" "}
              worth of food for Calgary families.
            </>
          ) : (
            <>Your donation is on its way to feeding Calgary families.</>
          )}
        </p>
        <p className="mt-3 text-[#8a7663]">
          A thank-you email and receipt are on the way to your inbox.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-[#e8622a] px-8 py-4 font-semibold text-white shadow-[0_12px_36px_rgba(232,98,42,0.35)] transition hover:bg-[#d4531e] hover:-translate-y-0.5"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
