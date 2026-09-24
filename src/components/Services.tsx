"use client";

import { useRef, useState } from "react";
import { services, type Tone } from "@/lib/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { toneClass } from "./Poster";

const tones: Tone[] = ["accent", "paper", "ink", "paper", "accent", "ink"];

// The title stays pinned on the left while each service rolls up on the right,
// growing in as it arrives and dimming as it leaves.
export function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>(".svc");
      panels.forEach((p, i) =>
        ScrollTrigger.create({
          trigger: p,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        }),
      );

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        panels.forEach((p) => {
          gsap.fromTo(
            p,
            { scale: 0.86, opacity: 0.4 },
            { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "top 40%", scrub: true } },
          );
          gsap.to(p, {
            opacity: 0.2,
            scale: 0.94,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: p, start: "bottom 45%", end: "bottom top", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" aria-labelledby="services-title" className="scroll-mt-16 border-t border-line">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-4 py-32 md:px-8 md:py-48 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 id="services-title" className="type-mass text-[15vw] md:text-[7rem] lg:text-[6.4vw] 2xl:text-[6rem]">
              Six ways to get noticed.
            </h2>
            <ol className="mt-10 hidden lg:block">
              {services.map((s, i) => (
                <li
                  key={s.key}
                  aria-current={i === active ? "step" : undefined}
                  className={`type-credit py-1 text-[2rem] ${i === active ? "text-accent" : "text-muted"}`}
                >
                  {s.name}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-7">
          {services.map((s, i) => (
            <article
              key={s.key}
              className={`svc flex min-h-[70svh] origin-top flex-col justify-between gap-12 p-7 md:p-12 ${toneClass[tones[i]]}`}
            >
              <h3 className="type-mass text-[13vw] md:text-[5.2rem]">{s.name}</h3>
              <div className="grid gap-8 md:grid-cols-2 md:items-end">
                <p className="max-w-[34ch] text-xl leading-snug md:text-2xl">{s.line}</p>
                {s.clients.length > 0 ? (
                  <div>
                    <p className="type-label opacity-70">Done for</p>
                    <ul className="type-credit mt-3 text-[1.55rem] leading-[1.05]">
                      {s.clients.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="type-credit text-[1.55rem] opacity-80">{s.note}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
