"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

const decoys = ["a template", "an AI prompt", "some agency"];

// The credit, as a joke that lands: the usual suspects get struck out one by
// one, then the real name gets the orange marker. The finished line is the
// default, so it never shows a decoy on its own.
export function FooterCredit() {
  const root = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 98%", once: true } })
          .fromTo(".strike", { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "power2.inOut", stagger: 0.28 })
          .fromTo(".credit-mark", { "--mark": 0 }, { "--mark": 1, duration: 0.45, ease: "power3.out" }, "+=0.1")
          .fromTo(".credit-name", { y: 6, autoAlpha: 0.4 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: "expo.out" }, "<");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <p ref={root} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[0.9375rem]">
      <span className="text-muted">Website by</span>
      {decoys.map((d, i) => (
        <span key={d} className="relative whitespace-nowrap text-muted">
          <s className="no-underline [text-decoration:none]">{d}</s>
          <span aria-hidden className="strike absolute inset-x-[-2px] top-1/2 h-[2px] origin-left bg-orange" />
          {i < decoys.length - 1 ? "," : "."}
        </span>
      ))}
      <a
        href="https://allenmatthew.me"
        target="_blank"
        rel="noopener"
        aria-label="Allen, allenmatthew.me (opens in a new tab)"
        className="credit-name mark credit-mark px-1 font-display text-lg font-extrabold tracking-[-0.02em] text-on-orange hover:text-fg"
      >
        Allen.
      </a>
    </p>
  );
}
