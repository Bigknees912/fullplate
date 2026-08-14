"use client";

import { useEffect, useRef } from "react";
import { Magnetic } from "./animations";

type NodeDef = {
  name: string;
  vx: number;
  vy: number;
  fam: number;
  appear: number;
  line: number;
  fill: number;
};

const NODES: NodeDef[] = [
  { name: "Forest Lawn", vx: 700, vy: 566, fam: 380, appear: 0.07, line: 0.11, fill: 0.21 },
  { name: "Dover", vx: 636, vy: 632, fam: 260, appear: 0.11, line: 0.17, fill: 0.30 },
  { name: "Ogden", vx: 604, vy: 726, fam: 190, appear: 0.15, line: 0.23, fill: 0.39 },
  { name: "Marlborough", vx: 664, vy: 430, fam: 210, appear: 0.21, line: 0.29, fill: 0.47 },
  { name: "Falconridge", vx: 772, vy: 262, fam: 320, appear: 0.29, line: 0.39, fill: 0.57 },
  { name: "Bowness", vx: 250, vy: 300, fam: 240, appear: 0.39, line: 0.51, fill: 0.70 },
];

const HUB = { vx: 505, vy: 512 };

const SUBS = [
  "1 in 6 Calgary households can't always afford enough food. Scroll to follow every dollar out across the city.",
  "From one hub, supply lines reach the neighbourhoods that need it most — one quadrant at a time.",
  "NW to SE, every area covered. This is what your donation looks like on the map.",
];

export function CalgaryHero() {
  const sceneRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const famRef = useRef<HTMLDivElement>(null);
  const mealsRef = useRef<HTMLDivElement>(null);
  const areasRef = useRef<HTMLSpanElement>(null);
  const h0Ref = useRef<HTMLHeadingElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    if (!canvas || !scene) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heads = [h0Ref.current, h1Ref.current, h2Ref.current];

    let W = 0;
    let H = 0;
    let raf = 0;
    let scrollP = reduce ? 1 : 0;
    let lastPhase = -1;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function project(vx: number, vy: number) {
      const wide = W > 900;
      let size: number;
      let cx: number;
      let cy: number;
      if (wide) {
        size = Math.min(W * 0.62, H * 0.82);
        cx = W * 0.63;
        cy = H * 0.5;
      } else if (W > 640) {
        size = Math.min(W * 0.9, H * 0.68);
        cx = W * 0.5;
        cy = H * 0.42;
      } else {
        size = Math.min(W * 0.82, H * 0.4);
        cx = W * 0.5;
        cy = H * 0.3;
      }
      return { x: cx + ((vx - 500) / 1000) * size, y: cy + ((vy - 500) / 1000) * size, s: size };
    }

    function computeProgress() {
      const rect = scene!.getBoundingClientRect();
      const total = scene!.offsetHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      return total > 0 ? passed / total : 0;
    }
    function onScroll() {
      if (!reduce) scrollP = computeProgress();
      if (hintRef.current) hintRef.current.style.opacity = scrollP > 0.06 ? "0" : "1";
    }

    const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function roundRect(x: number, y: number, w: number, h: number, r: number) {
      r = Math.min(r, w / 2, h / 2);
      ctx!.beginPath();
      ctx!.moveTo(x + r, y);
      ctx!.arcTo(x + w, y, x + w, y + h, r);
      ctx!.arcTo(x + w, y + h, x, y + h, r);
      ctx!.arcTo(x, y + h, x, y, r);
      ctx!.arcTo(x, y, x + w, y, r);
      ctx!.closePath();
    }

    function draw(time: number) {
      const c = ctx!;
      c.clearRect(0, 0, W, H);
      const p = scrollP;
      const base = project(0, 0);
      const scale = base.s / 1000;
      const cxp = project(500, 500);
      const half = base.s / 2;

      // quadrant grid
      c.save();
      c.strokeStyle = "rgba(120,95,70,0.14)";
      c.lineWidth = 1;
      c.setLineDash([5, 7]);
      c.beginPath(); c.moveTo(cxp.x, cxp.y - half); c.lineTo(cxp.x, cxp.y + half); c.stroke();
      c.beginPath(); c.moveTo(cxp.x - half, cxp.y); c.lineTo(cxp.x + half, cxp.y); c.stroke();
      c.setLineDash([]);
      c.strokeStyle = "rgba(120,95,70,0.10)";
      roundRect(cxp.x - half, cxp.y - half, base.s, base.s, 150 * scale);
      c.stroke();
      c.restore();

      // quadrant labels
      c.save();
      c.fillStyle = "rgba(120,95,70,0.35)";
      c.font = "600 12px Inter, system-ui, sans-serif";
      c.textAlign = "center";
      const pad = half * 0.5;
      c.fillText("NW", cxp.x - pad, cxp.y - pad);
      c.fillText("NE", cxp.x + pad, cxp.y - pad);
      c.fillText("SW", cxp.x - pad, cxp.y + pad);
      c.fillText("SE", cxp.x + pad, cxp.y + pad);
      c.restore();

      // Bow River
      const r1 = project(210, 200);
      const r2 = project(470, 470);
      const r3 = project(700, 560);
      const r4 = project(880, 820);
      c.save();
      c.lineCap = "round";
      c.strokeStyle = "rgba(90,150,180,0.30)";
      c.lineWidth = Math.max(6, 10 * scale);
      c.beginPath();
      c.moveTo(r1.x, r1.y);
      c.bezierCurveTo(r2.x, r2.y - 40, r2.x + 40, r2.y, r3.x, r3.y);
      c.bezierCurveTo(r3.x + 40, r3.y + 30, r4.x - 40, r4.y - 40, r4.x, r4.y);
      c.stroke();
      if (!reduce) {
        c.strokeStyle = "rgba(255,255,255,0.35)";
        c.lineWidth = Math.max(2, 3 * scale);
        c.setLineDash([14, 26]);
        c.lineDashOffset = -((time * 0.03) % 40);
        c.beginPath();
        c.moveTo(r1.x, r1.y);
        c.bezierCurveTo(r2.x, r2.y - 40, r2.x + 40, r2.y, r3.x, r3.y);
        c.bezierCurveTo(r3.x + 40, r3.y + 30, r4.x - 40, r4.y - 40, r4.x, r4.y);
        c.stroke();
        c.setLineDash([]);
      }
      c.restore();

      const hp = project(HUB.vx, HUB.vy);
      let fedFamilies = 0;
      let areasCovered = 0;

      for (const n of NODES) {
        const np = project(n.vx, n.vy);
        const appearT = clamp((p - n.appear) / 0.05, 0, 1);
        if (appearT <= 0) continue;
        const lineT = clamp((p - n.line) / 0.14, 0, 1);
        const fillT = clamp((p - n.fill) / 0.07, 0, 1);
        fedFamilies += n.fam * fillT;
        if (fillT >= 1) areasCovered++;

        if (lineT > 0) {
          const ex = lerp(hp.x, np.x, ease(lineT));
          const ey = lerp(hp.y, np.y, ease(lineT));
          c.save();
          c.strokeStyle = `rgba(232,98,42,${0.25 + 0.35 * fillT})`;
          c.lineWidth = Math.max(1.5, 2.2 * scale);
          c.beginPath(); c.moveTo(hp.x, hp.y); c.lineTo(ex, ey); c.stroke();
          if (!reduce && lineT < 1) {
            const tp = (time * 0.0007) % 1;
            const px = lerp(hp.x, ex, tp);
            const py = lerp(hp.y, ey, tp);
            c.fillStyle = "rgba(245,147,49,0.9)";
            c.beginPath(); c.arc(px, py, Math.max(2.2, 3 * scale), 0, 7); c.fill();
          }
          c.restore();
        }

        const baseR = Math.max(6, (9 + n.fam / 60) * scale);
        const pulse = reduce ? 0 : Math.sin(time * 0.004 + n.vx) * 0.5 + 0.5;
        c.save();
        c.translate(np.x, np.y);
        c.scale(appearT, appearT);

        if (fillT < 1) {
          const ringA = 0.5 + 0.4 * pulse * (1 - fillT);
          c.strokeStyle = `rgba(217,74,92,${ringA})`;
          c.lineWidth = 2.4;
          c.beginPath(); c.arc(0, 0, baseR + 6 + pulse * 5 * (1 - fillT), 0, 7); c.stroke();
          c.fillStyle = "rgba(217,74,92,0.14)";
          c.beginPath(); c.arc(0, 0, baseR, 0, 7); c.fill();
          c.strokeStyle = "rgba(217,74,92,0.9)";
          c.lineWidth = 2;
          c.beginPath(); c.arc(0, 0, baseR, 0, 7); c.stroke();
        }
        if (fillT > 0) {
          const glow = c.createRadialGradient(0, 0, 0, 0, 0, baseR + 16);
          glow.addColorStop(0, `rgba(232,98,42,${0.3 * fillT})`);
          glow.addColorStop(1, "rgba(232,98,42,0)");
          c.fillStyle = glow;
          c.beginPath(); c.arc(0, 0, baseR + 16, 0, 7); c.fill();
          c.fillStyle = `rgba(232,98,42,${0.35 + 0.65 * fillT})`;
          c.beginPath(); c.arc(0, 0, baseR * (0.55 + 0.45 * fillT), 0, 7); c.fill();
          c.strokeStyle = "#e8622a";
          c.lineWidth = 2.2;
          c.beginPath(); c.arc(0, 0, baseR, 0, 7); c.stroke();
          if (fillT >= 1) {
            c.strokeStyle = "#fff";
            c.lineWidth = 2;
            c.lineCap = "round";
            c.beginPath();
            c.moveTo(-baseR * 0.38, 0);
            c.lineTo(-baseR * 0.08, baseR * 0.32);
            c.lineTo(baseR * 0.42, -baseR * 0.34);
            c.stroke();
          }
        }
        c.restore();

        c.save();
        c.globalAlpha = appearT;
        c.fillStyle = fillT >= 1 ? "rgba(28,21,18,0.92)" : "rgba(90,77,64,0.85)";
        if (W <= 640) {
          c.font = "600 11px Inter, system-ui, sans-serif";
          c.textAlign = "center";
          c.fillText(n.name, np.x, np.y - baseR - 7);
        } else {
          c.font = "600 12px Inter, system-ui, sans-serif";
          c.textAlign = n.vx > 520 ? "left" : "right";
          c.fillText(n.name, np.x + (n.vx > 520 ? baseR + 8 : -(baseR + 8)), np.y + 4);
        }
        c.restore();
      }

      // hub
      c.save();
      const hubPulse = reduce ? 0 : Math.sin(time * 0.003) * 0.5 + 0.5;
      const hubR = Math.max(10, 14 * scale);
      const hg = c.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, hubR + 22 + hubPulse * 8);
      hg.addColorStop(0, "rgba(201,161,95,0.45)");
      hg.addColorStop(1, "rgba(201,161,95,0)");
      c.fillStyle = hg;
      c.beginPath(); c.arc(hp.x, hp.y, hubR + 22 + hubPulse * 8, 0, 7); c.fill();
      c.fillStyle = "#c9a15f";
      c.beginPath(); c.arc(hp.x, hp.y, hubR, 0, 7); c.fill();
      c.strokeStyle = "#fff";
      c.lineWidth = 2.5;
      c.beginPath(); c.arc(hp.x, hp.y, hubR, 0, 7); c.stroke();
      c.strokeStyle = "#fff";
      c.lineWidth = 2;
      c.beginPath(); c.arc(hp.x, hp.y, hubR * 0.42, 0, 7); c.stroke();
      c.fillStyle = "#fff";
      c.beginPath(); c.arc(hp.x, hp.y, hubR * 0.16, 0, 7); c.fill();
      c.fillStyle = "rgba(28,21,18,0.9)";
      c.font = "700 12px Inter, system-ui, sans-serif";
      c.textAlign = "center";
      c.fillText("Full Plate hub", hp.x, hp.y + hubR + 18);
      c.restore();

      if (famRef.current) famRef.current.textContent = Math.round(fedFamilies).toLocaleString();
      if (mealsRef.current) mealsRef.current.textContent = Math.round(fedFamilies * 11.5).toLocaleString();
      if (areasRef.current) areasRef.current.textContent = String(areasCovered);

      const phase = p < 0.2 ? 0 : p < 0.62 ? 1 : 2;
      if (phase !== lastPhase) {
        heads.forEach((el, i) => el && el.classList.toggle("on", i === phase));
        if (subRef.current) subRef.current.textContent = SUBS[phase];
        lastPhase = phase;
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="maphero" ref={sceneRef} aria-label="Full Plate reaching food-insecure areas across Calgary">
      <div className="sticky-stage">
        <canvas ref={canvasRef} aria-hidden="true" />

        <div className="legend" aria-hidden="true">
          <div className="li"><span className="sw" style={{ background: "#d94a5c" }} /> Food-insecure area</div>
          <div className="li"><span className="sw" style={{ background: "#e8622a" }} /> Reached by Full Plate</div>
          <div className="li"><span className="sw" style={{ background: "#c9a15f" }} /> Distribution hub</div>
        </div>

        <div className="overlay">
          <div className="copy">
            <span className="eyebrow"><span className="need-dot" /> Calgary · food insecurity, mapped</span>
            <div className="headlines">
              <h1 ref={h0Ref} className="on">Some Calgary areas <span className="need">go without.</span></h1>
              <h1 ref={h1Ref}>So we carry <span className="accent">food to them.</span></h1>
              <h1 ref={h2Ref}>Every quadrant. <span className="accent">Every plate.</span></h1>
            </div>
            <p className="sub" ref={subRef}>{SUBS[0]}</p>
            <div className="hero-cta">
              <Magnetic>
                <a
                  href="#donate"
                  className="inline-block rounded-full bg-[#e8622a] px-8 py-4 text-center font-semibold text-white shadow-[0_14px_40px_rgba(232,98,42,0.4)] transition hover:bg-[#d4531e] hover:-translate-y-0.5"
                >
                  Donate now
                </a>
              </Magnetic>
              <a
                href="#volunteer"
                className="inline-block rounded-full border-2 border-[#e0cdb6] bg-white/50 px-8 py-4 text-center font-semibold text-[#3a3128] backdrop-blur transition hover:border-[#e8622a] hover:text-[#c14a17]"
                style={{ pointerEvents: "auto" }}
              >
                Become a volunteer
              </a>
            </div>
            <div className="hud">
              <div><div className="n" ref={famRef}>0</div><div className="k">families reached</div></div>
              <div><div className="n" ref={mealsRef}>0</div><div className="k">meals delivered</div></div>
              <div><div className="n"><span ref={areasRef}>0</span><span style={{ color: "#6f5d4c" }}>/6</span></div><div className="k">areas covered</div></div>
            </div>
          </div>
        </div>

        <div className="hint" ref={hintRef}>
          Scroll
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
