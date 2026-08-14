import { Reveal } from "./motion";
import { Leaf } from "./leaf";

const FOUNDERS = [
  {
    name: "Michael Cai",
    role: "Founder",
    initials: "MC",
    why: `When I was growing up, my school would give out brown-bag lunches to kids who didn't have much. I was one of those kids. I still remember what it felt like to receive that bag and know that it was helping my family. I never forgot that feeling. Now, with Full Plate, I want to turn that experience into something bigger — giving back to the community that once helped my family and making sure other kids never feel alone when their families are struggling.`,
  },
  {
    name: "Mikko Ordanza",
    role: "Co-Founder",
    initials: "MO",
    why: `When my family first arrived in Canada, we didn't have much. My mom was working only 20 hours a week at KFC, so the Calgary Food Bank helped us save on groceries and provide for our family. I still remember enjoying things like ice cream and cake on our birthdays. The Food Bank helped us during a difficult time, and now I want to help other families the way they helped us.`,
  },
];

export function Founders() {
  return (
    <section id="founders" className="relative py-24 sm:py-32 scroll-mt-20 overflow-hidden">
      <Leaf className="pointer-events-none absolute -left-6 top-24 w-40 text-[#e8622a]/15 rotate-[25deg]" />
      <Leaf className="pointer-events-none absolute -right-8 bottom-24 w-48 text-[#f59331]/15 -rotate-[20deg]" />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block rounded-full bg-[#fbe9d8] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#c14a17]">
              Our story
            </span>
            <h2 className="mt-5 text-4xl sm:text-5xl font-bold text-[#1c1512]">
              Why we started Full Plate
            </h2>
            <p className="mt-4 text-lg text-[#5a4d40]">
              Two Calgarians who know what it&apos;s like to need a little help — and decided
              to be that help for someone else.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {FOUNDERS.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <article className="group relative h-full rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(200,90,30,0.08)] border border-[#f0e6d9] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(200,90,30,0.14)]">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 flex-none rounded-2xl bg-gradient-to-br from-[#e8622a] to-[#f59331] flex items-center justify-center text-2xl font-extrabold text-white shadow-inner">
                    {f.initials}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#1c1512]">{f.name}</h3>
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#e8622a]">
                      {f.role}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 font-display text-xl font-semibold text-[#c14a17]">
                    My Why
                  </div>
                  <p className="text-[#4a4038] leading-relaxed">{f.why}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-10 text-center text-sm text-[#7a6653]">
            Drop real portraits at <code className="text-[#c14a17]">/public/founders/michael.jpg</code> and{" "}
            <code className="text-[#c14a17]">/public/founders/mikko.jpg</code> to replace the
            initials.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
