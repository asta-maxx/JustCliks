"use client";

import { useRef, useState } from "react";
import { tagged } from "@/lib/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w) && !["and", "of", "the"].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const catering = ["NS Catering", "Krishna Catering", "Sowndarya Catering", "Dharma Catering", "Meenakshi Catering"];
const social = ["Aasife and Brothers Biriyani", "Meat Mr. Dosa", "2021 Mobiles", ...catering];
const creators = ["Senthil Balaji", "Pollachi Mahendran", "Ilyzly", "Aasife and Brothers Biriyani", "Supreme", "LIK", "Ne Forever"];

// Each count lights up exactly the clients it is made of. It ends with all of them.
const steps = [
  { n: 2, label: "founders we made the face of their business", lit: ["Naina Kadai", "Joel Prince"] },
  { n: 5, label: "catering companies on our posting calendar", lit: catering },
  { n: 7, label: "creator campaigns, from a film launch to biriyani", lit: creators },
  { n: 8, label: "brands whose social media we run every month", lit: social },
  { n: 16, label: "clients, and counting", lit: tagged.map((t) => t.name) },
];

export function Stats() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);
  const shown = useRef(0);

  // Scroll steps through the counts while the grid holds still.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        ScrollTrigger.create({
          trigger: pin.current,
          start: "top top+=72",
          end: () => `+=${window.innerHeight * 0.5 * (steps.length - 1)}`,
          pin: true,
          // Snapping only with a mouse or trackpad. On touch screens it fights the finger.
          snap: ScrollTrigger.isTouch ? undefined : { snapTo: 1 / (steps.length - 1), duration: { min: 0.2, max: 0.4 }, ease: "power2.inOut" },
          onUpdate: (self) => setStep(Math.round(self.progress * (steps.length - 1))),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // The big number counts to the new value, and the newly lit tiles pop.
  useGSAP(
    () => {
      const target = steps[step].n;
      const reduce = !window.matchMedia(MOTION_OK).matches;
      if (num.current) {
        if (reduce) num.current.textContent = String(target);
        else {
          const o = { v: shown.current };
          gsap.to(o, {
            v: target,
            duration: 0.6,
            ease: "power3.out",
            onUpdate: () => {
              if (num.current) num.current.textContent = String(Math.round(o.v));
            },
          });
        }
      }
      shown.current = target;
      if (!reduce) gsap.fromTo(".tile[data-lit='true']", { scale: 0.9 }, { scale: 1, duration: 0.45, ease: "back.out(2.5)", stagger: 0.03 });
    },
    { scope: root, dependencies: [step] },
  );

  const s = steps[step];

  return (
    <section ref={root} aria-labelledby="stats-title" className="theme-orange">
      <div ref={pin} className="wrap flex min-h-[calc(100svh-4.5rem)] flex-col justify-center py-14 md:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* The count */}
          <div className="lg:col-span-5">
            <h2 id="stats-title" className="t-label">
              The numbers so far
            </h2>
            <p className="mt-4 flex items-end gap-4" aria-live="polite">
              <span ref={num} className="t-num text-[clamp(6rem,16vw,13rem)] leading-[0.8]">
                {s.n}
              </span>
            </p>
            <p className="t-h3 mt-5 max-w-[16ch]">{s.label}</p>
            <p className="mt-4 max-w-[34ch] text-[0.9375rem] font-bold text-muted">
              Every lit tile is a real client. Keep scrolling to count them up.
            </p>

            {/* Step markers: which count you are on */}
            <ol className="mt-8 flex gap-2" aria-label="Counts">
              {steps.map((x, i) => (
                <li key={x.n}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    aria-current={i === step ? "step" : undefined}
                    aria-label={`${x.n} ${x.label}`}
                    className={`grid h-9 min-w-9 place-items-center px-2 text-sm font-bold tabular-nums ${i === step ? "bg-fg text-[#f68c25]" : "border-[1.5px] border-line-strong hover:border-fg"}`}
                  >
                    {x.n}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* The clients the count is made of */}
          <ul className="grid grid-cols-4 gap-1.5 sm:gap-2 lg:col-span-7">
            {tagged.map((c) => {
              const lit = s.lit.includes(c.name);
              return (
                <li
                  key={c.name}
                  data-lit={lit}
                  className={`tile flex aspect-square flex-col justify-between p-2 transition-colors duration-300 motion-reduce:transition-none sm:aspect-[5/4] sm:p-3 ${
                    lit ? "bg-fg text-[#f5f3ee]" : "border-[1.5px] border-line text-fg/35"
                  }`}
                >
                  <span className={`font-display text-lg font-extrabold leading-none tracking-[-0.03em] sm:text-2xl ${lit ? "text-[#f68c25]" : ""}`}>
                    {initials(c.name)}
                  </span>
                  <span className="hidden text-[0.8125rem] font-bold leading-tight sm:block">{c.name}</span>
                  <span className="sr-only">{lit ? " (counted)" : ""}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
