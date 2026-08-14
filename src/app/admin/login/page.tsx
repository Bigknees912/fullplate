"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
      setMessage("Check your inbox for a secure login link.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f1e8] px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-2xl font-extrabold tracking-tight text-[#1c1512]">
            Full Plate <span className="text-[#E8622A]">YYC</span>
          </div>
          <p className="text-sm text-[#8a7663] mt-1">Admin dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(200,90,30,0.10)] p-8">
          {status === "sent" ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✉️</div>
              <h1 className="text-lg font-bold text-[#1c1512]">Link sent</h1>
              <p className="text-sm text-[#6a5d4f] mt-2">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 className="text-lg font-bold text-[#1c1512] mb-1">Sign in</h1>
              <p className="text-sm text-[#8a7663] mb-6">
                Enter your admin email to receive a magic link.
              </p>
              <label className="block text-sm font-medium text-[#4a4038] mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#e6d8c7] bg-[#fbf7f1] px-4 py-3 text-[#2b2320] outline-none focus:border-[#E8622A] focus:ring-2 focus:ring-[#E8622A]/20 transition"
              />
              {status === "error" && (
                <p className="text-sm text-red-600 mt-3">{message}</p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-6 w-full rounded-xl bg-[#E8622A] px-4 py-3 font-semibold text-white transition hover:bg-[#d4531e] disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send magic link"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-[#a89684] mt-6">
          Only approved administrators can access this area.
        </p>
      </div>
    </main>
  );
}
