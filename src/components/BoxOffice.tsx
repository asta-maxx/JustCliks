"use client";

import { useRef } from "react";
import { stats, type Tone } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { toneClass } from "./Poster";

const tones: Tone[] = ["accent", "ink", "paper", "accent"];

// Each figure is a card that slides up and stacks over the last one.
export function BoxOffice() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".bo-card");
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          gsap.to(card, {
            scale: 0.9,
            yPercent: -4,
            ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 20%", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="bo-title" className="mx-auto max-w-[1400px] px-4 py-32 md:px-8 md:py-48">
      <h2 id="bo-title" className="type-mass text-[15vw] md:text-[7rem]">
        Box office so far.
      </h2>
      <dl className="mt-14 md:mt-20">
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{ top: `calc(5rem + ${i * 1.25}rem)` }}
            className={`bo-card sticky mb-6 flex min-h-[62svh] origin-top flex-col justify-between gap-6 p-7 md:flex-row md:items-end md:p-12 ${toneClass[tones[i]]}`}
          >
            <dt className="type-head order-2 max-w-[16ch] text-[2rem] md:text-[3.2rem]">{s.label}</dt>
            <dd className="type-mass order-1 text-[48vw] leading-[0.75] md:text-[26rem]">{s.n}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
