"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Aperture } from "@phosphor-icons/react";
import { feed } from "@/lib/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { FeedCard } from "./FeedCard";

const N = feed.length;
const EXTRA = 18;
const list = [...feed, ...feed.slice(0, EXTRA)];

// First client post at or after index `from`.
const nextClient = (from: number) => {
  let k = Math.ceil(from);
  while (feed[k % N].kind !== "client") k++;
  return k;
};

// The hook, live: a feed races past, blurred, and brakes on a client post.
// Press Clik and it stops on the next one for you.
export function ScrollStopper() {
  const root = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const blur = useRef<SVGFEGaussianBlurElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  const pos = useRef({ v: 0 });
  const geo = useRef({ step: 0, center: 0 });
  const tween = useRef<gsap.core.Tween | null>(null);
  const wait = useRef<gsap.core.Tween | null>(null);
  const motion = useRef(false);
  const cycleRef = useRef<() => void>(() => {});

  const [landed, setLanded] = useState(feed[0]);
  const [stops, setStops] = useState(0);

  const place = () => gsap.set(track.current, { y: geo.current.center - pos.current.v * geo.current.step });

  const land = () => {
    const item = feed[Math.round(pos.current.v) % N];
    setLanded(item);
    setStops((s) => s + 1);
    if (motion.current) {
      gsap.fromTo(flash.current, { opacity: 0.9 }, { opacity: 0, duration: 0.55, ease: "power2.out" });
      gsap.fromTo(frame.current, { scale: 1.07 }, { scale: 1, duration: 0.6, ease: "expo.out" });
      wait.current = gsap.delayedCall(2, cycleRef.current);
    }
  };

  const travel = (target: number, duration: number, ease: string) => {
    let last = performance.now();
    let lastV = pos.current.v;
    tween.current = gsap.to(pos.current, {
      v: target,
      duration,
      ease,
      onUpdate: () => {
        const now = performance.now();
        const dt = Math.max(now - last, 1) / 1000;
        const speed = (Math.abs(pos.current.v - lastV) * geo.current.step) / dt;
        last = now;
        lastV = pos.current.v;
        blur.current?.setAttribute("stdDeviation", `0 ${Math.min(speed / 240, 16).toFixed(2)}`);
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
        const cards = track.current!.children;
        const a = cards[0] as HTMLElement;
        const b = cards[1] as HTMLElement;
        geo.current.step = b.offsetTop - a.offsetTop;
        geo.current.center = (win.current!.clientHeight - a.offsetHeight) / 2;
        place();
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(win.current!);

      cycleRef.current = () => travel(nextClient(pos.current.v + 7), 2.2, "expo.inOut");

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        motion.current = true;
        const introPlaying = document.documentElement.dataset.introSeen !== "1";
        wait.current = gsap.delayedCall(introPlaying ? 3.6 : 1.4, cycleRef.current);

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

  // The hero's brand cursor presses Clik by firing this event.
  const onAutoClik = useEffectEvent(() => clik());
  useEffect(() => {
    const h = () => onAutoClik();
    window.addEventListener("jc:clik", h);
    return () => window.removeEventListener("jc:clik", h);
  }, []);

  function clik() {
    wait.current?.kill();
    tween.current?.kill();
    const target = nextClient(Math.floor(pos.current.v) + 1);
    if (motion.current) {
      travel(target, 0.8, "power3.out");
    } else {
      pos.current.v = target % N;
      place();
      land();
    }
  }

  return (
    <div ref={root} className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-end lg:gap-10">
      <svg aria-hidden className="absolute size-0">
        <filter id="vblur" x="0" y="-20%" width="100%" height="140%">
          <feGaussianBlur ref={blur} stdDeviation="0 0" />
        </filter>
      </svg>

      <div className="relative w-[min(300px,78vw)] shrink-0">
        <div
          ref={win}
          role="img"
          aria-label="A social feed scrolling past generic posts and stopping on JustCliks client posts"
          className="feed-mask relative h-[min(600px,66svh)] overflow-hidden"
        >
          <div ref={track} aria-hidden className="absolute inset-x-0 top-0 flex flex-col gap-3 [filter:url(#vblur)]">
            {list.map((item, i) => (
              <div key={i} className="aspect-[4/5] w-full shrink-0">
                <FeedCard item={item} />
              </div>
            ))}
          </div>
        </div>
        {/* Viewfinder corners around the post in focus */}
        <div
          ref={frame}
          aria-hidden
          className="pointer-events-none absolute inset-x-[-12px] top-1/2 aspect-[4/5] -translate-y-1/2"
        >
          <span className="absolute left-0 top-0 size-6 border-l-[3px] border-t-[3px] border-fg" />
          <span className="absolute right-0 top-0 size-6 border-r-[3px] border-t-[3px] border-fg" />
          <span className="absolute bottom-0 left-0 size-6 border-b-[3px] border-l-[3px] border-fg" />
          <span className="absolute bottom-0 right-0 size-6 border-b-[3px] border-r-[3px] border-fg" />
        </div>
        <div
          ref={flash}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 aspect-[4/5] -translate-y-1/2 bg-flash opacity-0"
        />
      </div>

      <div className="flex w-[min(300px,78vw)] flex-col gap-5 sm:w-44">
        <div aria-live="polite">
          <p className="t-label text-orange-ink">Stopped on</p>
          <p className="mt-2 font-display text-xl font-extrabold leading-tight tracking-[-0.02em]">{landed.title}</p>
          <p className="mt-1 text-sm text-muted">{landed.tag}</p>
        </div>
        <div className="h-px bg-line" />
        <div>
          <button type="button" data-clik onClick={clik} className="btn btn-primary w-full">
            <Aperture size={20} weight="bold" aria-hidden />
            Clik
          </button>
          <p className="mt-2 text-sm text-muted">Stop the feed yourself.</p>
        </div>
        <p className="t-label text-muted">Stops {String(stops).padStart(2, "0")}</p>
      </div>
    </div>
  );
}
