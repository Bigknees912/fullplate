"use client";

import { useEffect, useState } from "react";
import { DONATION_TIERS, MIN_DONATION, MAX_DONATION } from "@/lib/config";
import { Reveal } from "./motion";

export function DonateSection() {
  const [selected, setSelected] = useState<number | "custom">(50);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("donation") === "cancelled") setCancelled(true);
  }, []);

  const amount =
    selected === "custom" ? Math.round(Number(custom) * 100) / 100 : selected;
  const impact = Number.isFinite(amount) && amount > 0 ? amount * 3 : 0;

  async function donate() {
    setError("");
    if (!Number.isFinite(amount) || amount < MIN_DONATION) {
      setError(`Minimum donation is $${MIN_DONATION}.`);
      return;
    }
    if (amount > MAX_DONATION) {
      setError(`Maximum online donation is $${MAX_DONATION.toLocaleString()}.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <section id="donate" className="relative py-24 sm:py-32 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <span className="inline-block rounded-full bg-[#fbe9d8] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#c14a17]">
                Make a gift
              </span>
              <h2 className="mt-5 text-4xl sm:text-5xl font-bold text-[#1c1512] leading-[1.05]">
                Your dollar,
                <br />
                <span className="text-shimmer">tripled on the plate.</span>
              </h2>
              <p className="mt-5 text-lg text-[#5a4d40] leading-relaxed max-w-md">
                Through our partnership with the Calgary Food Bank, every $1 you give
                becomes about $3 worth of food for families across the city. One-time gift,
                no strings.
              </p>

              <div className="mt-8 rounded-2xl border border-[#eaddcc] bg-white/60 p-5">
                <div className="text-sm text-[#6f5d4c]">If you give</div>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#1c1512]">
                    ${Number.isFinite(amount) && amount > 0 ? amount.toLocaleString() : "0"}
                  </span>
                  <span className="text-[#c9b8a4]">→</span>
                  <span className="text-3xl font-extrabold text-[#e8622a]">
                    ${impact ? impact.toLocaleString() : "0"}
                  </span>
                  <span className="text-sm text-[#6f5d4c]">in food value</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-white p-7 sm:p-8 shadow-[0_20px_60px_rgba(200,90,30,0.12)] border border-[#f0e6d9]">
              {cancelled && (
                <div className="mb-5 rounded-xl bg-[#fff4ec] border border-[#f6d9c2] px-4 py-3 text-sm text-[#b3541f]">
                  Your checkout was cancelled — no charge was made. Ready when you are.
                </div>
              )}

              <label className="block text-sm font-semibold text-[#4a4038]">
                Choose an amount
              </label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {DONATION_TIERS.map((t) => {
                  const active = selected === t.amount;
                  return (
                    <button
                      key={t.amount}
                      onClick={() => setSelected(t.amount)}
                      className={`group rounded-xl border-2 px-4 py-4 text-left transition ${
                        active
                          ? "border-[#e8622a] bg-[#fff6ef]"
                          : "border-[#eee1d1] bg-white hover:border-[#f2c3a3]"
                      }`}
                    >
                      <div className="text-lg font-bold text-[#1c1512]">{t.label}</div>
                      <div className="text-xs text-[#6f5d4c]">{t.blurb}</div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setSelected("custom")}
                className={`mt-3 w-full rounded-xl border-2 px-4 py-3 text-left transition ${
                  selected === "custom"
                    ? "border-[#e8622a] bg-[#fff6ef]"
                    : "border-[#eee1d1] hover:border-[#f2c3a3]"
                }`}
              >
                <span className="text-sm font-semibold text-[#4a4038]">Custom amount</span>
              </button>

              {selected === "custom" && (
                <div className="mt-3 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6f5d4c]">$</span>
                  <input
                    type="number"
                    min={MIN_DONATION}
                    inputMode="decimal"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full rounded-xl border border-[#e6d8c7] bg-[#fbf7f1] pl-8 pr-4 py-3 outline-none focus:border-[#e8622a] focus:ring-2 focus:ring-[#e8622a]/20"
                  />
                </div>
              )}

              <label className="mt-5 block text-sm font-semibold text-[#4a4038]">
                Name <span className="font-normal text-[#7a6653]">(optional — for the wall of thanks)</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonymous"
                className="mt-2 w-full rounded-xl border border-[#e6d8c7] bg-[#fbf7f1] px-4 py-3 outline-none focus:border-[#e8622a] focus:ring-2 focus:ring-[#e8622a]/20"
              />

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <button
                onClick={donate}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-[#e8622a] px-6 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(232,98,42,0.35)] transition hover:bg-[#d4531e] hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
              >
                {loading ? "Redirecting to secure checkout…" : "Donate securely"}
              </button>

              <p className="mt-4 text-center text-xs text-[#7a6653]">
                Payments handled by Stripe. Currently in test mode while our nonprofit
                registration is finalized.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
