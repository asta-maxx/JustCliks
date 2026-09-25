"use client";

import Link from "next/link";
import { useRef } from "react";
import { services, tagged, work } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

const rows = [
  { href: "/#services", label: "Services", count: services.length, note: "Six ways we get you noticed" },
  { href: "/#work", label: "Work", count: work.length, note: "Songs, launches, feeds and founders" },
  { href: "/#clients", label: "Clients", count: tagged.length, note: "Everyone who trusts us with their feed" },
  { href: "/#contact", label: "Start a project", count: null, note: "Tell us what you need" },
];

// The footer's site map, set big: every row says what is behind it.
export function FooterIndex() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", once: true } });
        tl.from(".fi-row", { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: "expo.out" });
        gsap.utils.toArray<HTMLElement>(".fi-count").forEach((el, i) => {
          const o = { v: 0 };
          tl.to(o, { v: Number(el.dataset.n), duration: 0.8, ease: "power3.out", onUpdate: () => (el.textContent = String(Math.round(o.v))) }, 0.1 + i * 0.08);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <nav ref={root} aria-label="Footer" className="border-t border-line">
      <ul>
        {rows.map((r) => {
          const cta = r.count === null;
          return (
            <li key={r.label} className="fi-row border-b border-line">
              <Link
                href={r.href}
                className={`group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 sm:py-5 ${cta ? "text-orange" : "text-fg"}`}
              >
                <span className="flex items-start gap-2 font-display text-[clamp(1.75rem,4.2vw,3.25rem)] font-extrabold leading-none tracking-[-0.035em] group-hover:text-orange">
                  {r.label}
                  {r.count !== null && (
                    <span
                      className="fi-count mt-1 grid h-6 min-w-6 place-items-center bg-orange px-1.5 font-sans text-xs font-bold tabular-nums tracking-normal text-[#1c1c1b] sm:h-7 sm:min-w-7 sm:text-sm"
                      data-n={r.count}
                    >
                      {r.count}
                    </span>
                  )}
                </span>
                <span className="col-span-2 text-sm text-muted sm:col-span-1 sm:text-right">{r.note}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
