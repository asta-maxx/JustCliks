"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

// One CSS pixel is about 0.2646 mm, so scroll distance can be read in metres.
const MM_PER_PX = 0.2646;
const toMetres = (px: number) => (px * MM_PER_PX) / 1000;
const format = (m: number) => (m < 1 ? `${Math.max(1, Math.round(m * 100))} cm` : `${m.toFixed(1)} m`);

// An orange tape measure, pulled out to the distance scrolled. Ticks every
// 10 cm, a label every half metre, the case on the right says where you are.
function Tape({ metres }: { metres: number }) {
  const [pxPerM, setPxPerM] = useState(360);
  useEffect(() => {
    const fit = () => setPxPerM(window.innerWidth < 768 ? 220 : 360);
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const tenths = Math.max(1, Math.ceil(metres * 10));
  const width = tenths * (pxPerM / 10) + 24;
  const H = 56;

  return (
    <div aria-hidden className="relative mt-14 flex h-[4.5rem] items-center">
      <div className="relative h-full min-w-0 flex-1 overflow-hidden">
        <div className="tape-roll absolute right-0 top-1/2 -translate-y-1/2 bg-[#f68c25]" style={{ width, height: H }}>
          <svg width={width} height={H} className="block">
            {/* The metal hook at the start of the tape: the top of the page */}
            <rect x="0" y="0" width="8" height={H} fill="#1c1c1b" />
            {Array.from({ length: tenths + 1 }, (_, i) => {
              const x = 12 + i * (pxPerM / 10);
              const whole = i % 10 === 0;
              const half = i % 5 === 0;
              return (
                <g key={i}>
                  <rect x={x} y="0" width={whole ? 3 : 2} height={whole ? 26 : half ? 18 : 10} fill="#1c1c1b" />
                  {half && i > 0 && (
                    <text x={x + 5} y={H - 10} fill="#1c1c1b" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fontWeight="600">
                      {whole ? `${i / 10} m` : (i / 10).toFixed(1)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      {/* The case the tape comes out of */}
      <div className="relative z-10 grid h-full w-28 shrink-0 place-items-center bg-fg px-2 text-center text-bg sm:w-36">
        <p className="t-label leading-snug text-bg">
          You are
          <br />
          here
        </p>
        <span className="absolute -left-1.5 top-1/2 h-8 w-1.5 -translate-y-1/2 bg-fg" />
      </div>
    </div>
  );
}

// The footer's hook: it measures how far this visitor actually scrolled to
// reach it. That is the attention JustCliks builds for brands.
export function ScrollMeter() {
  const root = useRef<HTMLDivElement>(null);
  const out = useRef<HTMLSpanElement>(null);
  const total = useRef(0);
  const [metres, setMetres] = useState<number | null>(null);

  useGSAP(
    () => {
      let last = window.scrollY;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          total.current += Math.abs(y - last);
          last = y;
        },
      });
      const show = () => {
        const px = Math.max(total.current, window.scrollY + window.innerHeight);
        setMetres(toMetres(px));
      };
      ScrollTrigger.create({ trigger: root.current, start: "top 80%", onEnter: show, onEnterBack: show });
    },
    { scope: root },
  );

  // Count up and pull the tape out together.
  useGSAP(
    () => {
      if (metres === null || !out.current) return;
      if (!window.matchMedia(MOTION_OK).matches) {
        out.current.textContent = format(metres);
        return;
      }
      const o = { v: 0 };
      gsap.to(o, {
        v: metres,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: () => {
          if (out.current) out.current.textContent = format(o.v);
        },
      });
      gsap.fromTo(".tape-roll", { xPercent: 100 }, { xPercent: 0, duration: 1.6, ease: "power3.out" });
      gsap.fromTo(".meter-mark", { "--mark": 0 }, { "--mark": 1, duration: 0.6, ease: "power3.out", delay: 0.2 });
    },
    { scope: root, dependencies: [metres] },
  );

  // Back to the top, the fast way: a quick race up with a blur, like the feed.
  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return window.scrollTo({ top: 0 });
    const main = document.querySelector("main");
    const o = { y: window.scrollY };
    gsap.to(o, {
      y: 0,
      duration: 1.1,
      ease: "expo.inOut",
      onUpdate: () => window.scrollTo(0, o.y),
      onStart: () => main && gsap.to(main, { filter: "blur(6px)", duration: 0.3 }),
      onComplete: () => main && gsap.to(main, { filter: "blur(0px)", duration: 0.3, clearProps: "filter" }),
    });
  };

  return (
    <div ref={root}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="t-label text-orange-ink">You made it to the bottom</p>
          <p className="t-display mt-5 max-w-[16ch] text-[clamp(2.6rem,6vw,5.6rem)]">
            You scrolled{" "}
            <span className="mark meter-mark whitespace-nowrap px-1 text-on-orange">
              <span ref={out}>0 m</span>
            </span>{" "}
            to get here.
          </p>
          <p className="t-lead mt-6 max-w-[44ch]">
            That is the kind of attention we build for brands. Imagine it pointed at yours.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <Link href="#contact" className="btn btn-primary h-14 px-7 text-base">
            Start a project
          </Link>
          <button type="button" onClick={toTop} className="btn btn-ghost h-14 px-6 text-base">
            <ArrowUp size={20} weight="bold" aria-hidden />
            Back to top, the fast way
          </button>
        </div>
      </div>

      {metres !== null && <Tape metres={metres} />}
      {metres === null && <div aria-hidden className="mt-14 h-[4.5rem]" />}
    </div>
  );
}
