"use client";

import { useRef, useState } from "react";
import { Aperture } from "@phosphor-icons/react";
import { feed } from "@/lib/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Poster, toneClass } from "./Poster";

const N = feed.length;
const ROLL = 24;
const HOLD = 1.3;

// A feed of real projects flicks past like a phone scroll. Press Clik to
// freeze a frame, with a flash, and it lands on the contact strip.
export function Viewfinder() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);

  const idx = useRef(0);
  const motion = useRef(false);
  const tween = useRef<gsap.core.Tween | null>(null);
  const wait = useRef<gsap.core.Tween | null>(null);
  const step = useRef<() => void>(() => {});

  const [shots, setShots] = useState<number[]>([]);
  const [count, setCount] = useState(0);
  const [caption, setCaption] = useState("Press Clik to grab a frame.");

  useGSAP(
    () => {
      const place = () =>
        gsap.set(strip.current, { yPercent: -(idx.current * 100) / (N + 1) });

      step.current = () => {
        idx.current += 1;
        tween.current = gsap.to(strip.current, {
          yPercent: -(idx.current * 100) / (N + 1),
          duration: 0.6,
          ease: "expo.inOut",
          onComplete: () => {
            // The last slide is a copy of the first, so jump back silently.
            if (idx.current === N) {
              idx.current = 0;
              place();
            }
            wait.current = gsap.delayedCall(HOLD, step.current);
          },
        });
      };

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        motion.current = true;
        wait.current = gsap.delayedCall(2.2, step.current);

        // Only roll while the viewfinder is on screen.
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) {
              tween.current?.resume();
              wait.current?.resume();
            } else {
              tween.current?.pause();
              wait.current?.pause();
            }
          },
        });

        return () => {
          motion.current = false;
          st.kill();
          wait.current?.kill();
          tween.current?.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  function capture() {
    wait.current?.kill();
    if (tween.current?.isActive()) tween.current.progress(1);
    wait.current?.kill();

    const current = idx.current % N;
    const next = count + 1 > ROLL ? 1 : count + 1;
    setCount(next);
    setShots((s) => (next === 1 ? [current] : [...s, current]).slice(-5));
    setCaption(
      next === 1 && count === ROLL
        ? `Roll full, new roll loaded. Captured ${feed[current].title}.`
        : `Captured ${feed[current].title}.`,
    );

    if (motion.current) {
      gsap.fromTo(flash.current, { opacity: 1 }, { opacity: 0, duration: 0.55, ease: "power2.out" });
      gsap.fromTo(frame.current, { scale: 0.975 }, { scale: 1, duration: 0.5, ease: "expo.out" });
      wait.current = gsap.delayedCall(HOLD + 0.4, step.current);
    } else {
      // No auto-scroll with reduced motion, so each press moves the feed on by one.
      idx.current = (idx.current + 1) % N;
      gsap.set(strip.current, { yPercent: -(idx.current * 100) / (N + 1) });
    }
  }

  const frames = [...feed, feed[0]];

  return (
    <div
      ref={root}
      className="w-full max-w-[460px] lg:max-w-[min(460px,calc((100dvh-14rem)*0.8))]"
    >
      <div className="relative bg-paper p-3">
        {(["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"] as const).map(
          (pos) => (
            <span key={pos} aria-hidden className={`vf-corner absolute size-6 border-ink ${pos}`} />
          ),
        )}
        <div
          ref={frame}
          role="img"
          aria-label="A feed of recent JustCliks projects"
          className="relative aspect-[4/5] w-full overflow-hidden"
        >
          <div
            ref={strip}
            aria-hidden
            className="absolute inset-x-0 top-0"
            style={{ height: `${(N + 1) * 100}%` }}
          >
            {frames.map((f, i) => (
              <div key={i} style={{ height: `${100 / (N + 1)}%` }}>
                <Poster title={f.title} tag={f.tag} tone={f.tone} tamil={f.tamil} />
              </div>
            ))}
          </div>
          <div
            ref={flash}
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[var(--flash)] opacity-0"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={capture}
          className="btn btn-primary h-14 shrink-0 px-6 text-base"
        >
          <Aperture size={22} weight="bold" aria-hidden />
          Clik
        </button>
        <div className="min-w-0 flex-1">
          <p className="type-label text-muted">
            {String(count).padStart(2, "0")} / {ROLL}
          </p>
          <p aria-live="polite" className="mt-1 truncate text-sm">
            {caption}
          </p>
        </div>
        <ol aria-label="Captured frames" className="hidden shrink-0 gap-1 sm:flex">
          {shots.map((s, i) => (
            <li
              key={`${i}-${s}`}
              title={feed[s].title}
              className={`@container grid h-11 w-9 place-items-center ${toneClass[feed[s].tone]}`}
            >
              <span className="type-mass text-[60cqw]">{feed[s].title[0]}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
