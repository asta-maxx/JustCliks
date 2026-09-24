"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";

const credits: [string, string][] = [
  ["Directed by", "JustCliks"],
  ["Starring", "You"],
  ["Catering by", "NS, Krishna, Sowndarya, Dharma and Meenakshi Catering"],
  ["Biriyani by", "Aasife and Brothers"],
  ["Phones by", "2021 Mobiles"],
  ["Shot in", site.region],
];

// End credits. Rows roll up into place as the page runs out.
export function CreditsRoll() {
  const root = useRef<HTMLDListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".credit", {
          y: 70,
          opacity: 0,
          stagger: 0.25,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 90%", end: "bottom 60%", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <dl ref={root} className="mx-auto grid max-w-[44rem] gap-7 text-center">
      {credits.map(([k, v]) => (
        <div key={k} className="credit">
          <dt className="type-label text-muted">{k}</dt>
          <dd className="type-credit mt-2 text-[2.1rem] leading-[0.95] md:text-[2.6rem]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
