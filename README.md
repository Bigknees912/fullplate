# Full Plate YYC

Website for **Full Plate YYC**, a Calgary nonprofit that turns every $1 donated into
~3× its value in food, in partnership with the Calgary Food Bank.

Built with Next.js (App Router) + Supabase + Stripe + Resend, deployed on Vercel.

## Features

- **Public site** — animated landing page: mission, impact, founders' stories, donate, and a
  volunteer signup form.
- **Donations** — Stripe Checkout (test mode) with fixed tiers + custom amount, one-time gifts.
- **Webhook** — verifies Stripe signatures and logs successful payments to Supabase.
- **Thank-you email** — sent automatically via Resend on a successful donation.
- **Admin dashboard** (`/admin`) — Supabase-auth-protected (magic link), shows total raised and
  a donation table. Access is limited to emails in the `admin_users` allowlist.
- **Volunteer signups** — stored in the `volunteers` table.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

## Environment variables

See `.env.example`. Notably:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project + public key |
| `SUPABASE_WEBHOOK_DB_SECRET` | Server-only secret gating the `record_donation()` DB function |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` | Stripe **test** keys |
| `STRIPE_WEBHOOK_SECRET` | Signing secret from the Stripe webhook endpoint (`whsec_…`) |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Resend sending key + verified From address |
| `NEXT_PUBLIC_SITE_URL` | Public base URL (used for Stripe redirects) |

## Database

Schema lives in Supabase (migrations applied to the `fullplate-yyc` project):

- `donations` — one row per successful payment.
- `admin_users` — email allowlist for `/admin`.
- `volunteers` — volunteer form submissions.
- `app_config` — internal key/value (holds the webhook DB secret); locked down, no RLS policies.
- `record_donation(...)` — `SECURITY DEFINER` function; the only path that inserts donations,
  gated by the shared secret so the public anon key can never forge a donation.

To add an admin, insert their email into `admin_users`. They sign in at `/admin/login` with a
magic link.

## Stripe webhook setup

After deploying, create a webhook endpoint in the Stripe dashboard (test mode) pointing at
`https://<your-domain>/api/stripe/webhook`, subscribe to `checkout.session.completed`, and put
the signing secret in `STRIPE_WEBHOOK_SECRET`.

## Deployment

Deployed on Vercel. Set all environment variables in the Vercel project settings, and set
`NEXT_PUBLIC_SITE_URL` to the deployment URL.
