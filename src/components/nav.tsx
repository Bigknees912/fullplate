"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#mission", label: "Mission" },
  { href: "#impact", label: "Impact" },
  { href: "#founders", label: "Our Story" },
  { href: "#volunteer", label: "Volunteer" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#f7f1e8]/85 backdrop-blur-md border-b border-[#e7dac8] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <PlateMark className="w-8 h-8 text-[#e8622a] transition-transform group-hover:rotate-12" />
          <span className="text-lg font-extrabold tracking-tight text-[#1c1512]">
            Full Plate <span className="text-[#e8622a]">YYC</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#5a4d40] hover:text-[#e8622a] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#donate"
            className="rounded-full bg-[#e8622a] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(232,98,42,0.35)] transition hover:bg-[#d4531e] hover:-translate-y-0.5"
          >
            Donate
          </a>
        </div>

        <button
          className="md:hidden p-2 text-[#1c1512]"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="md:hidden mx-auto max-w-6xl px-6 pt-4 pb-2 flex flex-col gap-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[#5a4d40] font-medium py-1"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#donate"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-full bg-[#e8622a] px-5 py-2.5 text-center text-sm font-semibold text-white"
          >
            Donate
          </a>
        </div>
      )}
    </header>
  );
}

export function PlateMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <circle cx="24" cy="26" r="12" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="26" r="5.5" stroke="currentColor" strokeWidth="2.5" />
      <path d="M11 8v9a3 3 0 003 3M14 8v9M8 8v9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M37 8c-2.2 0-4 2.7-4 6s1.8 6 4 6V8zM37 20v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
