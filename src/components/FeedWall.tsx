"use client";

import { useRef, useState } from "react";
import { feed, type FeedItem } from "@/lib/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { FeedCard } from "./FeedCard";

const N = feed.length;
const rotate = (by: number): FeedItem[] => feed.map((_, i) => feed[(i + by) % N]);

// Five columns of the same feed, each running at its own speed. Only the
// centre one is aimed: it always lands on a client post in the viewfinder.
// It runs on its own; there is nothing to press.
const COLUMNS = [
  { id: "l2", items: rotate(9), mult: 0.58, offset: 3.4, cls: "hidden md:block w-[150px] lg:w-[180px]" },
  { id: "l1", items: rotate(5), mult: 0.78, offset: 1.7, cls: "w-[108px] sm:w-[150px] lg:w-[190px]" },
  { id: "c", items: feed, mult: 1, offset: 0, cls: "w-[152px] sm:w-[190px] lg:w-[210px]" },
  { id: "r1", items: rotate(14), mult: 0.78, offset: 2.5, cls: "w-[108px] sm:w-[150px] lg:w-[190px]" },
  { id: "r2", items: rotate(22), mult: 0.58, offset: 0.8, cls: "hidden md:block w-[150px] lg:w-[180px]" },
] as const;

const nextClient = (from: number) => {
  let k = Math.ceil(from);
  while (feed[k % N].kind !== "client") k++;
  return k;
};
const wrap = (v: number) => ((v % N) + N) % N;

export function FeedWall() {
  const root = useRef<HTMLDivElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  const blur = useRef<SVGFEGaussianBlurElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  const pos = useRef({ v: 0 });
  const geo = useRef<{ step: number; center: number; el: HTMLElement }[]>([]);
  const tween = useRef<gsap.core.Tween | null>(null);
  const wait = useRef<gsap.core.Tween | null>(null);
  const motion = useRef(false);
  const cycleRef = useRef<() => void>(() => {});

  const [landed, setLanded] = useState(feed[0]);
  const [stops, setStops] = useState(0);

  const place = () => {
    COLUMNS.forEach((c, i) => {
      const g = geo.current[i];
      if (!g) return;
      const p = c.id === "c" ? pos.current.v : wrap(pos.current.v * c.mult + c.offset);
      gsap.set(g.el, { y: g.center - p * g.step });
    });
  };

  const dimSides = (on: boolean) =>
    gsap.to(".wall-side", { opacity: on ? 0.28 : 1, duration: on ? 0.5 : 0.2, ease: "power2.out", overwrite: true });

  const land = () => {
    setLanded(feed[Math.round(pos.current.v) % N]);
    setStops((s) => s + 1);
    if (motion.current) {
      dimSides(true);
      gsap.fromTo(flash.current, { opacity: 0.9 }, { opacity: 0, duration: 0.55, ease: "power2.out" });
      gsap.fromTo(frame.current, { scale: 1.08 }, { scale: 1, duration: 0.6, ease: "expo.out" });
      wait.current = gsap.delayedCall(2.2, cycleRef.current);
    }
  };

  const travel = (target: number, duration: number, ease: string) => {
    dimSides(false);
    let last = performance.now();
    let lastV = pos.current.v;
    const step = geo.current[2]?.step ?? 200;
    tween.current = gsap.to(pos.current, {
      v: target,
      duration,
      ease,
      onUpdate: () => {
        const now = performance.now();
        const speed = (Math.abs(pos.current.v - lastV) * step) / Math.max((now - last) / 1000, 0.001);
        last = now;
        lastV = pos.current.v;
        blur.current?.setAttribute("stdDeviation", `0 ${Math.min(speed / 220, 16).toFixed(2)}`);
        place();
      },
      onComplete: () => {
        blur.current?.setAttribute("stdDeviation", "0 0");
        if (pos.current.v >= N) {
          pos.current.v -= N;
          place();
        }
        land();
      },
    });
  };

  useGSAP(
    () => {
      const measure = () => {
        const tracks = gsap.utils.toArray<HTMLElement>(".wall-track", root.current);
        const h = wall.current!.clientHeight;
        geo.current = tracks.map((el) => {
          const a = el.children[0] as HTMLElement;
          const b = el.children[1] as HTMLElement;
          return { el, step: b.offsetTop - a.offsetTop, center: (h - a.offsetHeight) / 2 };
        });
        place();
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(wall.current!);

      cycleRef.current = () => travel(nextClient(pos.current.v + 7), 2.3, "expo.inOut");

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        motion.current = true;
        const introPlaying = document.documentElement.dataset.introSeen !== "1";
        wait.current = gsap.delayedCall(introPlaying ? 3.4 : 1.2, cycleRef.current);
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            const fn = self.isActive ? "resume" : "pause";
            tween.current?.[fn]();
            wait.current?.[fn]();
          },
        });
        return () => {
          motion.current = false;
          st.kill();
          tween.current?.kill();
          wait.current?.kill();
        };
      });
      return () => {
        ro.disconnect();
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <svg aria-hidden className="absolute size-0">
        <filter id="wblur" x="0" y="-20%" width="100%" height="140%">
          <feGaussianBlur ref={blur} stdDeviation="0 0" />
        </filter>
      </svg>

      {/* Labels say what the wall means before anyone has to work it out */}
      <div aria-hidden className="mb-3 flex justify-center gap-2.5 sm:gap-4">
        {COLUMNS.map((c) => (
          <div key={c.id} className={`relative h-8 shrink-0 ${c.cls}`}>
            {c.id === "l1" && (
              <p className="absolute bottom-0 right-0 whitespace-nowrap text-right text-sm text-muted">
                <span className="sm:hidden">Everyone else</span>
                <span className="hidden sm:inline">Everyone else&apos;s posts</span>
              </p>
            )}
            {c.id === "c" && (
              <p className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 whitespace-nowrap font-display font-extrabold tracking-[-0.02em]">
                <span className="size-2.5 bg-orange" />
                <span className="sm:hidden">Yours</span>
                <span className="hidden sm:inline">Yours, with JustCliks</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div
        ref={wall}
        role="img"
        aria-label="A wall of social feeds racing past generic posts and stopping on JustCliks client posts."
        className="wall-mask relative flex h-[min(360px,40svh)] justify-center gap-2.5 overflow-hidden sm:gap-4 lg:h-[min(400px,44svh)]"
      >
        {COLUMNS.map((c) => (
          <div key={c.id} className={`relative shrink-0 ${c.cls} ${c.id === "c" ? "z-10" : "wall-side"}`}>
            <div aria-hidden className="wall-track absolute inset-x-0 top-0 flex flex-col gap-2.5 [filter:url(#wblur)] sm:gap-4">
              {[...c.items, ...c.items].map((item, i) => (
                <div key={i} className="aspect-[4/5] w-full shrink-0">
                  <FeedCard item={item} />
                </div>
              ))}
            </div>
            {c.id === "c" && (
              <>
                <div ref={frame} aria-hidden className="pointer-events-none absolute inset-x-[-9px] top-1/2 aspect-[4/5] -translate-y-1/2">
                  <span className="absolute left-0 top-0 size-5 border-l-[3px] border-t-[3px] border-fg sm:size-6" />
                  <span className="absolute right-0 top-0 size-5 border-r-[3px] border-t-[3px] border-fg sm:size-6" />
                  <span className="absolute bottom-0 left-0 size-5 border-b-[3px] border-l-[3px] border-fg sm:size-6" />
                  <span className="absolute bottom-0 right-0 size-5 border-b-[3px] border-r-[3px] border-fg sm:size-6" />
                </div>
                <div ref={flash} aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 aspect-[4/5] -translate-y-1/2 bg-flash opacity-0" />
              </>
            )}
          </div>
        ))}
      </div>

      {/* What it stopped on, and where to go next */}
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4 sm:mt-6">
        <div aria-live="polite" className="min-w-0">
          <p className="t-label text-orange-ink">
            Stopped on <span className="text-muted">/ {String(stops).padStart(2, "0")}</span>
          </p>
          <p className="mt-1 truncate font-display text-lg font-extrabold leading-tight tracking-[-0.02em]">
            {landed.title} <span className="font-sans text-sm font-medium text-muted">{landed.tag}</span>
          </p>
        </div>
        <a href="#clients" className="shrink-0 text-right text-sm font-bold underline decoration-orange decoration-2 underline-offset-4 hover:decoration-fg">
          <span className="sm:hidden">16 clients</span>
          <span className="hidden sm:inline">Trusted by 16 brands and people</span>
        </a>
      </div>
    </div>
  );
}
