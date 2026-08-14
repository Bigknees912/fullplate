"use client";

import { useState } from "react";
import { Reveal } from "./motion";

const INTERESTS = [
  "Food sorting & packing",
  "Delivery & logistics",
  "Events & fundraising",
  "Social media & outreach",
  "Wherever I'm needed",
];

export function VolunteerForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: INTERESTS[0],
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section id="volunteer" className="relative py-24 sm:py-32 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <span className="inline-block rounded-full bg-[#fbe9d8] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#c14a17]">
                Lend a hand
              </span>
              <h2 className="mt-5 text-4xl sm:text-5xl font-bold text-[#1c1512] leading-[1.05]">
                Give your time,
                <br />
                <span className="text-[#e8622a]">fill a plate.</span>
              </h2>
              <p className="mt-5 text-lg text-[#5a4d40] leading-relaxed max-w-md">
                Money moves food, but people move mountains. Whether you can spare an
                afternoon or a weekend, there&apos;s a place for you on the Full Plate crew.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "No experience needed — we&apos;ll show you the ropes",
                  "Flexible shifts that fit around school and work",
                  "Meet good people doing good work in Calgary",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[#4a4038]">
                    <span className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#e8622a] text-xs text-white">
                      ✓
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: t }} />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-white p-7 sm:p-8 shadow-[0_20px_60px_rgba(200,90,30,0.10)] border border-[#f0e6d9]">
              {status === "done" ? (
                <div className="py-10 text-center">
                  <div className="text-5xl">🧡</div>
                  <h3 className="mt-4 text-2xl font-bold text-[#1c1512]">You&apos;re in!</h3>
                  <p className="mt-2 text-[#6a5d4f]">
                    Thanks, {form.name.split(" ")[0] || "friend"}. We&apos;ll reach out soon
                    with upcoming volunteer opportunities.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <h3 className="text-xl font-bold text-[#1c1512]">Sign up to volunteer</h3>
                  <Field label="Full name" required>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className={inputCls}
                      placeholder="Your name"
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Email" required>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={inputCls}
                        placeholder="you@example.com"
                      />
                    </Field>
                    <Field label="Phone">
                      <input
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className={inputCls}
                        placeholder="(403) 000-0000"
                      />
                    </Field>
                  </div>
                  <Field label="How would you like to help?">
                    <select
                      value={form.interest}
                      onChange={(e) => update("interest", e.target.value)}
                      className={inputCls}
                    >
                      {INTERESTS.map((i) => (
                        <option key={i}>{i}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Anything else?">
                    <textarea
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      rows={3}
                      className={inputCls}
                      placeholder="Availability, questions, or a hello…"
                    />
                  </Field>

                  {status === "error" && <p className="text-sm text-red-600">{error}</p>}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full rounded-xl bg-[#e8622a] px-6 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(232,98,42,0.30)] transition hover:bg-[#d4531e] hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Count me in"}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl border border-[#e6d8c7] bg-[#fbf7f1] px-4 py-3 outline-none focus:border-[#e8622a] focus:ring-2 focus:ring-[#e8622a]/20 transition";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[#4a4038]">
        {label}
        {required && <span className="text-[#e8622a]"> *</span>}
      </span>
      {children}
    </label>
  );
}
