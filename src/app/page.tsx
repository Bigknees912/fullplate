import { Nav, PlateMark } from "@/components/nav";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Leaf } from "@/components/leaf";
import { Founders } from "@/components/founders";
import { DonateSection } from "@/components/donate-section";
import { VolunteerForm } from "@/components/volunteer-form";
import { SITE } from "@/lib/config";

export default function Home() {
  return (
    <div id="top" className="relative overflow-hidden">
      <Nav />
      <Hero />
      <Marquee />
      <Impact />
      <Mission />
      <Partnership />
      <Founders />
      <DonateSection />
      <VolunteerForm />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-20">
      {/* ambient gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-[#f7b98a]/40 blur-3xl" />
        <div className="absolute top-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#f59331]/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#e8622a]/15 blur-3xl" />
      </div>

      <Leaf className="pointer-events-none absolute right-8 top-32 hidden w-40 text-[#e8622a]/25 rotate-[18deg] animate-float md:block [--r:18deg]" />
      <Leaf className="pointer-events-none absolute left-6 bottom-24 hidden w-32 text-[#f59331]/25 -rotate-[24deg] animate-float md:block [--r:-24deg]" />

      <div className="mx-auto max-w-6xl px-6 w-full">
        <div className="max-w-3xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e9d6bf] bg-white/60 px-4 py-1.5 text-sm font-medium text-[#c14a17] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#e8622a] animate-pulse" />
              A Calgary nonprofit, in partnership with the Calgary Food Bank
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] text-[#1c1512]">
              We turn{" "}
              <span className="relative whitespace-nowrap">
                <span className="text-shimmer">every $1</span>
              </span>
              <br />
              into <span className="text-[#e8622a]">3× the food.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg sm:text-xl text-[#5a4d40] leading-relaxed">
              Full Plate YYC feeds Calgary. Your donation stretches three times as far,
              putting real meals on the tables of families who need them most.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <a
                href="#donate"
                className="rounded-full bg-[#e8622a] px-8 py-4 text-center font-semibold text-white shadow-[0_14px_40px_rgba(232,98,42,0.4)] transition hover:bg-[#d4531e] hover:-translate-y-0.5"
              >
                Donate now
              </a>
              <a
                href="#volunteer"
                className="rounded-full border-2 border-[#e0cdb6] bg-white/50 px-8 py-4 text-center font-semibold text-[#3a3128] backdrop-blur transition hover:border-[#e8622a] hover:text-[#c14a17]"
              >
                Become a volunteer
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
              {[
                ["3×", "food value per $1"],
                ["100%", "community-driven"],
                ["YYC", "made in Calgary"],
              ].map(([big, small]) => (
                <div key={small}>
                  <div className="text-3xl font-extrabold text-[#1c1512]">{big}</div>
                  <div className="text-sm text-[#6f5d4c]">{small}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = [
    "Feed Calgary",
    "Every plate matters",
    "$1 → 3× in food",
    "Nobody goes hungry",
    "Community first",
  ];
  const row = [...words, ...words];
  return (
    <div className="relative border-y border-[#e7dac8] bg-[#efe4d3]/60 py-4 overflow-hidden">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8 text-lg font-semibold text-[#b3906d]">
            {w}
            <PlateMark className="h-5 w-5 text-[#e8622a]" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Impact() {
  const cards = [
    {
      k: "$1 becomes $3",
      t: "Triple the reach",
      d: "Bulk sourcing and our Calgary Food Bank partnership multiply the buying power of every gift by three.",
    },
    {
      k: "One-time, simple",
      t: "Give in 30 seconds",
      d: "Pick a tier or a custom amount, check out securely with Stripe, and you're done. No account, no hassle.",
    },
    {
      k: "Local & transparent",
      t: "Calgary, start to finish",
      d: "Funds raised here feed people here. Watch the total grow and see exactly where your generosity lands.",
    },
  ];

  return (
    <section id="impact" className="relative py-24 sm:py-32 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-[#fbe9d8] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#c14a17]">
              The impact
            </span>
            <h2 className="mt-5 text-4xl sm:text-5xl font-bold text-[#1c1512]">
              A small gift, multiplied
            </h2>
          </div>
        </Reveal>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <StaggerItem key={c.t}>
              <div className="group h-full rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(200,90,30,0.06)] border border-[#f0e6d9] transition hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(200,90,30,0.14)]">
                <div className="mb-5 inline-flex rounded-xl bg-[#fff3ea] px-3 py-1 text-sm font-bold text-[#e8622a]">
                  {c.k}
                </div>
                <h3 className="text-2xl font-bold text-[#1c1512]">{c.t}</h3>
                <p className="mt-3 text-[#5a4d40] leading-relaxed">{c.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section id="mission" className="relative py-24 sm:py-32 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#e8622a] to-[#f59331] px-8 py-16 sm:px-16 sm:py-24 text-white">
          <Leaf className="pointer-events-none absolute -right-6 -top-6 w-48 text-white/15 rotate-[30deg]" />
          <Leaf className="pointer-events-none absolute -left-8 bottom-0 w-56 text-white/10 -rotate-[20deg]" />
          <Reveal>
            <div className="relative max-w-3xl">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Our mission
              </div>
              <p className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.15]">
                No one in Calgary should wonder where their next meal comes from. We raise
                funds, multiply them into food, and get it to the families who need it —{" "}
                <span className="text-[#ffe9d8]">one full plate at a time.</span>
              </p>
              <div className="mt-10 flex items-center gap-3 text-white/90">
                <PlateMark className="h-7 w-7" />
                <span className="font-semibold">Full Plate YYC</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Partnership() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-[#eaddcc] bg-white/60 px-8 py-12 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="max-w-xl">
              <div className="text-sm font-semibold uppercase tracking-wide text-[#c14a17]">
                Proud partner
              </div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-[#1c1512]">
                Working hand in hand with the Calgary Food Bank
              </h3>
              <p className="mt-3 text-[#5a4d40]">
                Their infrastructure and our fundraising mean your dollar goes further than it
                ever could alone.
              </p>
            </div>
            <div className="flex h-24 w-24 flex-none items-center justify-center rounded-2xl bg-[#fff3ea] text-[#e8622a]">
              <svg viewBox="0 0 24 24" className="h-11 w-11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21c-4.5-2.6-8-5.8-8-9.6A4.4 4.4 0 0 1 12 8.2 4.4 4.4 0 0 1 20 11.4c0 3.8-3.5 7-8 9.6Z" />
                <path d="M12 8.2V11" />
              </svg>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative mt-8 border-t border-[#e7dac8] bg-[#efe4d3]/50">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <PlateMark className="h-8 w-8 text-[#e8622a]" />
              <span className="text-lg font-extrabold tracking-tight text-[#1c1512]">
                Full Plate <span className="text-[#e8622a]">YYC</span>
              </span>
            </div>
            <p className="mt-4 text-[#5a4d40]">{SITE.tagline}</p>
            <p className="mt-2 text-sm text-[#6f5d4c]">{SITE.city}</p>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <div className="text-sm font-semibold text-[#1c1512]">Explore</div>
              <ul className="mt-3 space-y-2 text-sm text-[#5a4d40]">
                <li><a href="#mission" className="hover:text-[#e8622a]">Mission</a></li>
                <li><a href="#impact" className="hover:text-[#e8622a]">Impact</a></li>
                <li><a href="#founders" className="hover:text-[#e8622a]">Our story</a></li>
                <li><a href="#volunteer" className="hover:text-[#e8622a]">Volunteer</a></li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#1c1512]">Connect</div>
              <ul className="mt-3 space-y-2 text-sm text-[#5a4d40]">
                <li>
                  <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-[#e8622a]">
                    Instagram {SITE.instagramHandle}
                  </a>
                </li>
                <li><a href="#donate" className="hover:text-[#e8622a]">Donate</a></li>
                <li><a href="/admin" className="hover:text-[#e8622a]">Admin</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[#e0d1bd] pt-6 text-sm text-[#6f5d4c] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Full Plate YYC. Feeding Calgary, together.</span>
          <span>Donations currently in test mode while registration is finalized.</span>
        </div>
      </div>
    </footer>
  );
}
