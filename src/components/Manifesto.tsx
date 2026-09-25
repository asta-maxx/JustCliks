"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

// The words light up in reading order as you scroll, like a line being delivered.
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".manifesto", { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.13 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: ".manifesto", start: "top 78%", end: "bottom 42%", scrub: true },
          },
        );
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="What we do" className="wrap grid py-28 md:py-40 lg:grid-cols-12">
      <p className="manifesto t-h2 lg:col-span-10">
        Your customers scroll past almost everything. We make the post they <span className="mark">stop</span>{" "}
        for. Then the next one, and the one after that, until your name is the one they{" "}
        <span className="mark">remember.</span>
      </p>
    </section>
  );
}
