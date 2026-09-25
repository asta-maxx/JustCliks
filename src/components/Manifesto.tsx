"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

// The words light up in reading order as you scroll, like a line being
// delivered, and each orange marker sweeps in the moment its word does.
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".manifesto", { type: "words" });
        const words = split.words as HTMLElement[];
        const step = 0.1;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".manifesto", start: "top 78%", end: "bottom 42%", scrub: true },
        });
        tl.fromTo(words, { opacity: 0.13 }, { opacity: 1, ease: "none", duration: 0.3, stagger: step }, 0);
        gsap.utils.toArray<HTMLElement>(".manifesto .mark").forEach((mark) => {
          const at = words.findIndex((w) => mark.contains(w));
          tl.fromTo(mark, { "--mark": 0 }, { "--mark": 1, ease: "none", duration: 0.3 }, Math.max(at, 0) * step + 0.15);
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="What we do" className="wrap section-y grid lg:grid-cols-12">
      <p className="manifesto t-h2 lg:col-span-10">
        Your customers scroll past almost everything. We make the post they <span className="mark">stop</span>{" "}
        for. Then the next one, and the one after that, until your name is the one they{" "}
        <span className="mark">remember.</span>
      </p>
    </section>
  );
}
