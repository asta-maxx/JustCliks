"use client";

import { useRef } from "react";
import { stats } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

// Real counts from the client list. Each number rolls up from zero once.
export function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".stat-n").forEach((el) => {
          const end = Number(el.dataset.n);
          const o = { v: 0 };
          gsap.to(o, {
            v: end,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate: () => (el.textContent = String(Math.round(o.v))),
          });
        });
        const line = root.current!.querySelector<SVGPathElement>(".stats-line")!;
        const len = line.getTotalLength();
        gsap
          .timeline({ scrollTrigger: { trigger: line, start: "top 85%", end: "top 45%", scrub: 0.6 } })
          .fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: "none" })
          .fromTo(".stats-head", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, ease: "none", duration: 0.15 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="stats-title" className="border-t border-line">
      <div className="wrap py-28 md:py-40">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <h2 id="stats-title" className="t-h2 max-w-[18ch] lg:col-span-5">
            The numbers so far.
          </h2>
          {/* The logo's growth arrow, drawn as the section scrolls in */}
          <svg aria-hidden viewBox="0 0 700 160" className="h-24 w-full overflow-visible md:h-32 lg:col-span-7">
            <path className="stats-line" d="M4 150 C 200 146, 380 120, 520 70 S 640 18, 668 12" fill="none" stroke="var(--orange)" strokeWidth="10" />
            <polygon className="stats-head" points="640,0 700,4 676,56" fill="var(--orange)" />
          </svg>
        </div>
        <dl className="mt-14 grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-4 border-b border-line py-8 pr-6 lg:border-b-0 lg:py-10 ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i % 2 ? "border-l pl-6 lg:pl-8" : ""}`}
            >
              <dt className="order-2 max-w-[22ch] text-[0.9375rem] text-muted">{s.label}</dt>
              <dd className="stat-n t-num order-1 text-[4rem] text-fg md:text-[5.5rem]" data-n={s.n}>
                {s.n}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
