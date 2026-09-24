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
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="stats-title" className="border-t border-line">
      <div className="wrap py-28 md:py-40">
        <h2 id="stats-title" className="t-h2 max-w-[18ch]">
          The numbers so far.
        </h2>
        <dl className="mt-14 grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-4 border-b border-line py-8 pr-6 lg:border-b-0 lg:py-10 ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i % 2 ? "border-l pl-6 lg:pl-8" : ""}`}
            >
              <dt className="order-2 max-w-[22ch] text-[0.9375rem] text-muted">{s.label}</dt>
              <dd className="stat-n t-num order-1 text-[4rem] text-orange md:text-[5.5rem]" data-n={s.n}>
                {s.n}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
