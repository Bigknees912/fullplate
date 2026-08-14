import { Resend } from "resend";
import { SITE } from "./config";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.RESEND_FROM_EMAIL || "Full Plate YYC <hello@runsable.com>";

function fmt(cents: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export async function sendThankYouEmail(opts: {
  to: string;
  name: string;
  amountCents: number;
  currency: string;
}) {
  if (!resend) {
    console.warn("Resend not configured; skipping thank-you email.");
    return;
  }

  const amount = fmt(opts.amountCents, opts.currency);
  const first = opts.name?.trim()?.split(" ")[0] || "friend";

  const html = `
  <div style="margin:0;padding:0;background:#f7f1e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
      <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(200,90,30,0.10);">
        <div style="background:linear-gradient(135deg,#E8622A,#F59331);padding:36px 32px;text-align:center;">
          <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Full Plate YYC</div>
          <div style="font-size:13px;color:#ffe9d8;margin-top:6px;">Feeding Calgary, together</div>
        </div>
        <div style="padding:36px 32px;color:#2b2320;">
          <h1 style="font-size:24px;margin:0 0 12px;color:#1c1512;">Thank you, ${first} 🧡</h1>
          <p style="font-size:16px;line-height:1.6;margin:0 0 18px;color:#4a4038;">
            Your gift of <strong>${amount}</strong> just went to work. Because every dollar we raise
            stretches to <strong>3× its value in food</strong> through our partnership with the
            Calgary Food Bank, your donation reaches further than you might think.
          </p>
          <div style="background:#fbf3ea;border:1px solid #f0dcc7;border-radius:14px;padding:18px 20px;margin:0 0 20px;">
            <div style="font-size:13px;color:#8a7663;text-transform:uppercase;letter-spacing:1px;">Your impact</div>
            <div style="font-size:28px;font-weight:800;color:#E8622A;margin-top:4px;">${amount} → ${fmt(opts.amountCents * 3, opts.currency)} in food</div>
          </div>
          <p style="font-size:15px;line-height:1.6;margin:0 0 8px;color:#4a4038;">
            This receipt confirms your one-time donation. We'll keep you posted on the meals your
            generosity helps put on Calgary tables.
          </p>
          <p style="font-size:15px;line-height:1.6;margin:20px 0 0;color:#4a4038;">
            With gratitude,<br/><strong>The Full Plate YYC team</strong>
          </p>
        </div>
        <div style="padding:20px 32px;background:#faf5ee;text-align:center;font-size:12px;color:#9a8b7a;">
          Follow us on Instagram <a href="${SITE.instagram}" style="color:#E8622A;text-decoration:none;">${SITE.instagramHandle}</a><br/>
          ${SITE.city}
        </div>
      </div>
    </div>
  </div>`;

  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `Thank you for your ${amount} gift to Full Plate YYC`,
    html,
  });
}
