"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

const decoys = ["a template", "some agency", "an AI prompt", "a cousin", "a free theme"];
const reel = [...decoys, ...decoys, "Allen"];

// The site credit is a tiny scroll stopper: the slot races past the usual
// suspects, blurs, and brakes on the real name. It plays once, on arrival.
export function FooterCredit() {
  const root = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLSpanElement>(null);
  const list = useRef<HTMLSpanElement>(null);
  const blur = useRef<SVGFEGaussianBlurElement>(null);
  const roll = useRef<() => void>(() => {});

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>(".credit-item", list.current);
        const line = items[0].offsetHeight;
        const widest = Math.max(...items.map((i) => i.offsetWidth));
        const last = items[items.length - 1];

        roll.current = () => {
          let prev = 0;
          let prevT = performance.now();
          gsap.killTweensOf([list.current, slot.current, ".credit-corner", ".credit-after", ".credit-flash"]);
          gsap.set(list.current, { y: 0 });
          gsap.set(slot.current, { width: widest });
          gsap.set(".credit-after", { autoAlpha: 0, x: -6 });
          gsap.set(".credit-corner", { autoAlpha: 0 });
          gsap
            .timeline()
            .to(list.current, {
              y: -(items.length - 1) * line,
              duration: 1.7,
              ease: "expo.inOut",
              onUpdate() {
                const y = gsap.getProperty(list.current, "y") as number;
                const now = performance.now();
                const speed = Math.abs(y - prev) / Math.max((now - prevT) / 1000, 0.001);
                prev = y;
                prevT = now;
                blur.current?.setAttribute("stdDeviation", `0 ${Math.min(speed / 260, 6).toFixed(2)}`);
              },
              onComplete: () => blur.current?.setAttribute("stdDeviation", "0 0"),
            })
            .to(slot.current, { width: last.offsetWidth, duration: 0.35, ease: "expo.out" })
            .fromTo(".credit-flash", { opacity: 0.9 }, { opacity: 0, duration: 0.45, ease: "power2.out", immediateRender: false }, "<")
            .fromTo(
              ".credit-corner",
              { autoAlpha: 0, scale: 1.8 },
              { autoAlpha: 1, scale: 1, duration: 0.45, ease: "expo.out", stagger: 0.03, immediateRender: false },
              "<",
            )
            .to(".credit-after", { autoAlpha: 1, x: 0, duration: 0.5, ease: "expo.out" }, "-=0.2");
        };

        // Start parked on the first decoy, then roll when the footer shows up.
        gsap.set(slot.current, { width: widest });
        gsap.set(list.current, { y: 0 });
        gsap.set(".credit-after", { autoAlpha: 0 });
        gsap.set(".credit-corner", { autoAlpha: 0 });
        ScrollTrigger.create({ trigger: root.current, start: "top 95%", once: true, onEnter: () => roll.current() });
      });
      // Reduced motion: no roll, just the name, sized to fit.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".credit-item", list.current);
        gsap.set(slot.current, { width: items[items.length - 1].offsetWidth });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <svg aria-hidden className="absolute size-0">
        <filter id="credit-blur" x="0" y="-50%" width="100%" height="200%">
          <feGaussianBlur ref={blur} stdDeviation="0 0" />
        </filter>
      </svg>

      <p className="flex items-center gap-2 text-fg">
        <span className="text-muted">Website by</span>
        <a
          href="https://allenmatthew.me"
          target="_blank"
          rel="noopener"
          aria-label="Allen, allenmatthew.me (opens in a new tab)"
          className="group relative inline-block px-1.5 py-0.5"
        >
          {/* Viewfinder corners that snap on when it lands */}
          <span aria-hidden className="credit-corner absolute left-0 top-0 size-2 border-l-[1.5px] border-t-[1.5px] border-fg" />
          <span aria-hidden className="credit-corner absolute right-0 top-0 size-2 border-r-[1.5px] border-t-[1.5px] border-fg" />
          <span aria-hidden className="credit-corner absolute bottom-0 left-0 size-2 border-b-[1.5px] border-l-[1.5px] border-fg" />
          <span aria-hidden className="credit-corner absolute bottom-0 right-0 size-2 border-b-[1.5px] border-r-[1.5px] border-fg" />
          <span aria-hidden className="credit-flash pointer-events-none absolute inset-0 bg-orange opacity-0" />

          <span ref={slot} aria-hidden className="relative block h-[1.5em] overflow-hidden">
            <span
              ref={list}
              className="block [filter:url(#credit-blur)]"
              style={{ transform: `translateY(-${(reel.length - 1) * 1.5}em)` }}
            >
              {reel.map((w, i) => (
                <span
                  key={i}
                  className={`credit-item block w-max whitespace-nowrap leading-[1.5em] ${
                    i === reel.length - 1
                      ? "font-display font-extrabold tracking-[-0.02em] text-fg underline decoration-orange decoration-[3px] underline-offset-[0.22em] group-hover:decoration-fg"
                      : "text-muted"
                  }`}
                >
                  {w}
                </span>
              ))}
            </span>
          </span>
        </a>
      </p>

      <p className="credit-after text-muted">Stopped on the right one.</p>

    </div>
  );
}
