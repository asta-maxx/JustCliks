"use client";

import { useRef } from "react";
import { Play } from "@phosphor-icons/react";
import type { ServiceKey } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

type VisualProps = { play: boolean };

// Runs `build` when `play` turns on, and cleans it up when it turns off.
function usePlay(scope: React.RefObject<HTMLElement | null>, play: boolean, build: () => void) {
  useGSAP(
    () => {
      if (!play) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, build);
      return () => mm.revert();
    },
    { scope, dependencies: [play] },
  );
}

const Stage = ({ label, aside, children }: { label: string; aside?: string; children: React.ReactNode }) => (
  <div className="flex h-full flex-col gap-4 p-5 md:p-7">
    <div className="flex items-baseline justify-between gap-4">
      <p className="t-label text-muted">{label}</p>
      {aside && <p className="t-label text-orange">{aside}</p>}
    </div>
    <div className="relative min-h-0 flex-1">{children}</div>
  </div>
);

/* Social media management: a posting calendar filling up for the week */
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const social = ["Aasife", "Meat Mr. Dosa", "2021 Mobiles", "NS", "Krishna", "Sowndarya", "Dharma", "Meenakshi"];
const slots: Record<number, { type: string; tone: string }> = {
  0: { type: "Reel", tone: "bg-orange text-on-orange" },
  2: { type: "Post", tone: "bg-fg text-bg" },
  3: { type: "Story", tone: "bg-surface text-fg" },
  5: { type: "Reel", tone: "bg-orange text-on-orange" },
  8: { type: "Post", tone: "bg-fg text-bg" },
  9: { type: "Reel", tone: "bg-orange text-on-orange" },
  11: { type: "Story", tone: "bg-surface text-fg" },
  13: { type: "Post", tone: "bg-fg text-bg" },
  14: { type: "Reel", tone: "bg-orange text-on-orange" },
  16: { type: "Post", tone: "bg-fg text-bg" },
  18: { type: "Story", tone: "bg-surface text-fg" },
  20: { type: "Reel", tone: "bg-orange text-on-orange" },
};

function SocialVisual({ play }: VisualProps) {
  const ref = useRef<HTMLDivElement>(null);
  usePlay(ref, play, () => {
    gsap.from(".cal-post", { scale: 0.4, autoAlpha: 0, duration: 0.5, stagger: 0.09, ease: "back.out(2)" });
  });
  let n = 0;
  return (
    <div ref={ref} className="h-full">
      <Stage label="Posting calendar" aside="Festival week">
        <div className="grid h-full grid-cols-7 grid-rows-[auto_1fr_1fr_1fr] gap-1.5">
          {days.map((d) => (
            <p key={d} className="t-label pb-1 text-center text-[0.625rem] text-dim">
              {d}
            </p>
          ))}
          {Array.from({ length: 21 }, (_, i) => {
            const s = slots[i];
            return (
              <div key={i} className="relative bg-surface-2">
                {s && (
                  <div className={`cal-post absolute inset-0 flex flex-col justify-between p-1.5 md:p-2 ${s.tone}`}>
                    <span className="t-label text-[0.5625rem] opacity-80">{s.type}</span>
                    <span className="truncate text-[0.625rem] font-bold leading-tight md:text-xs">{social[n++ % social.length]}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Stage>
    </div>
  );
}

/* Content creation: one idea, cut three ways */
function ContentVisual({ play }: VisualProps) {
  const ref = useRef<HTMLDivElement>(null);
  usePlay(ref, play, () => {
    const tl = gsap.timeline();
    tl.from(".fmt", { y: 40, autoAlpha: 0, duration: 0.7, stagger: 0.12, ease: "expo.out" })
      .to(".slides", { xPercent: -33.333, duration: 0.6, ease: "expo.inOut", repeat: -1, repeatDelay: 1.2, yoyo: true })
      .fromTo(".story-fill", { scaleX: 0 }, { scaleX: 1, duration: 3, ease: "none", repeat: -1 }, 0.4);
  });
  return (
    <div ref={ref} className="h-full">
      <Stage label="One shoot, three formats">
        <div className="flex h-full items-end justify-center gap-4 md:gap-6">
          <figure className="fmt flex h-full flex-col items-center gap-2">
            <div className="relative flex aspect-[9/16] min-h-0 flex-1 flex-col justify-between bg-orange p-3 text-on-orange">
              <span className="t-label text-[0.5625rem]">0:15</span>
              <Play size={28} weight="fill" className="self-center" aria-hidden />
              <span className="font-display text-sm font-extrabold leading-tight">Plating the biriyani</span>
            </div>
            <figcaption className="t-label text-[0.625rem] text-muted">Reel</figcaption>
          </figure>
          <figure className="fmt flex h-[62%] flex-col items-center gap-2">
            <div className="relative aspect-square min-h-0 flex-1 overflow-hidden bg-fg text-bg">
              <div className="slides flex h-full w-[300%]">
                {["The menu", "The kitchen", "The crowd"].map((t) => (
                  <div key={t} className="flex h-full w-1/3 items-end p-3">
                    <span className="font-display text-sm font-extrabold leading-tight">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <figcaption className="t-label text-[0.625rem] text-muted">Carousel</figcaption>
          </figure>
          <figure className="fmt flex h-[84%] flex-col items-center gap-2">
            <div className="relative flex aspect-[9/16] min-h-0 flex-1 flex-col justify-between border border-line bg-surface-2 p-3">
              <div className="flex gap-1">
                <span className="h-0.5 flex-1 bg-fg" />
                <span className="relative h-0.5 flex-1 overflow-hidden bg-fg/25">
                  <span className="story-fill absolute inset-0 origin-left bg-fg" />
                </span>
                <span className="h-0.5 flex-1 bg-fg/25" />
              </div>
              <span className="font-display text-sm font-extrabold leading-tight">Open till midnight</span>
            </div>
            <figcaption className="t-label text-[0.625rem] text-muted">Story</figcaption>
          </figure>
        </div>
      </Stage>
    </div>
  );
}

/* Influencer marketing: one brief going out to the right creators */
const creators = ["Food", "Film", "Comedy", "Local", "Lifestyle"];
function InfluencerVisual({ play }: VisualProps) {
  const ref = useRef<HTMLDivElement>(null);
  usePlay(ref, play, () => {
    const paths = gsap.utils.toArray<SVGPathElement>(".wire");
    paths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", delay: 0.2 });
    });
    gsap.from(".creator", { y: 16, autoAlpha: 0, duration: 0.5, stagger: 0.08, delay: 0.7, ease: "expo.out" });
    gsap.utils.toArray<SVGRectElement>(".brief").forEach((b, i) => {
      const p = paths[i];
      const len = p.getTotalLength();
      const o = { t: 0 };
      gsap.to(o, {
        t: 1,
        duration: 1.4,
        ease: "power1.inOut",
        repeat: -1,
        repeatDelay: 0.6,
        delay: 1.2 + i * 0.18,
        onUpdate: () => {
          const pt = p.getPointAtLength(o.t * len);
          b.setAttribute("x", String(pt.x - 4));
          b.setAttribute("y", String(pt.y - 4));
        },
      });
    });
  });
  return (
    <div ref={ref} className="h-full">
      <Stage label="Brief to creators" aside="Tracked per post">
        <svg viewBox="0 0 600 300" className="h-full w-full" role="img" aria-label="One brand brief sent to five kinds of creators">
          {creators.map((_, i) => {
            const cx = 60 + i * 120;
            return <path key={i} className="wire" d={`M300 64 V150 H${cx} V226`} fill="none" stroke="rgb(244 242 238 / 0.35)" strokeWidth="1.5" />;
          })}
          {creators.map((_, i) => (
            <rect key={i} className="brief" x="296" y="60" width="8" height="8" fill="var(--orange)" />
          ))}
          <g>
            <rect x="215" y="8" width="170" height="56" fill="var(--orange)" />
            <text x="300" y="42" textAnchor="middle" className="fill-on-orange font-display text-[18px] font-extrabold">
              Your brand
            </text>
          </g>
          {creators.map((c, i) => {
            const cx = 60 + i * 120;
            return (
              <g key={c} className="creator">
                <rect x={cx - 52} y="226" width="104" height="60" fill="var(--fg)" />
                <text x={cx} y="253" textAnchor="middle" className="fill-bg font-display text-[16px] font-extrabold">
                  {c}
                </text>
                <text x={cx} y="273" textAnchor="middle" className="fill-bg font-mono text-[10px] uppercase tracking-[0.1em]">
                  creator
                </text>
              </g>
            );
          })}
        </svg>
      </Stage>
    </div>
  );
}

/* Video production: an edit timeline with the playhead running */
const tracks = [
  { name: "V1", clips: [[0, 22, "bg-orange"], [24, 30, "bg-orange"], [56, 20, "bg-orange"], [78, 22, "bg-orange"]] },
  { name: "V2", clips: [[10, 18, "bg-fg"], [44, 16, "bg-fg"], [70, 14, "bg-fg"]] },
  { name: "A1", clips: [[0, 100, "bg-surface"]] },
] as const;

function VideoVisual({ play }: VisualProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);
  usePlay(ref, play, () => {
    const o = { t: 0 };
    gsap.to(o, {
      t: 1,
      duration: 7,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        gsap.set(".playhead", { left: `${o.t * 100}%` });
        const f = Math.floor(o.t * 94 * 25);
        const s = Math.floor(f / 25);
        const pad = (n: number) => String(n).padStart(2, "0");
        if (tc.current) tc.current.textContent = `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(f % 25)}`;
      },
    });
  });
  return (
    <div ref={ref} className="h-full">
      <Stage label="Edit" aside="Final grade">
        <div className="flex h-full flex-col gap-3">
          <div className="relative flex min-h-0 flex-1 items-center justify-center border border-line bg-bg">
            <p className="font-display text-lg font-extrabold tracking-[-0.02em] md:text-2xl">Tamil Christian song</p>
            <span ref={tc} className="t-label absolute bottom-2 right-3 text-orange">
              00:00:00:00
            </span>
          </div>
          <div className="relative grid grid-cols-[2.5rem_1fr] gap-y-1.5">
            {tracks.map((t) => (
              <div key={t.name} className="contents">
                <span className="t-label self-center text-[0.625rem] text-dim">{t.name}</span>
                <div className="relative h-6 bg-surface-2">
                  {t.clips.map(([l, w, c], i) => (
                    <span key={i} className={`absolute inset-y-0.5 ${c}`} style={{ left: `${l}%`, width: `${w - 1}%` }} />
                  ))}
                </div>
              </div>
            ))}
            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-10 right-0">
              <span className="playhead absolute inset-y-[-4px] left-0 w-0.5 bg-orange" />
            </div>
          </div>
        </div>
      </Stage>
    </div>
  );
}

/* Personal branding: the founder becomes the face of the business */
const founders = [
  { initials: "AJ", name: "Ajay", role: "Founder, Naina Kadai" },
  { initials: "JP", name: "Joel Prince", role: "Purpose coach" },
];
function PersonalVisual({ play }: VisualProps) {
  const ref = useRef<HTMLDivElement>(null);
  usePlay(ref, play, () => {
    const tl = gsap.timeline({ repeat: -1 });
    tl.from(".face-0 > *", { y: 20, autoAlpha: 0, stagger: 0.07, duration: 0.5, ease: "expo.out" })
      .to(".face-0", { autoAlpha: 0, duration: 0.3 }, "+=2.4")
      .fromTo(".face-1", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 })
      .from(".face-1 > *", { y: 20, autoAlpha: 0, stagger: 0.07, duration: 0.5, ease: "expo.out" })
      .to(".face-1", { autoAlpha: 0, duration: 0.3 }, "+=2.4")
      .set(".face-0", { autoAlpha: 1 });
  });
  return (
    <div ref={ref} className="h-full">
      <Stage label="Founder profile">
        {founders.map((f, i) => (
          <div key={f.name} className={`face-${i} absolute inset-0 grid grid-cols-[auto_1fr] items-center gap-5 md:gap-8 ${i ? "invisible" : ""}`}>
            <div className="grid aspect-square h-[70%] max-h-56 place-items-center bg-orange text-on-orange">
              <span className="font-display text-5xl font-extrabold tracking-[-0.04em] md:text-7xl">{f.initials}</span>
            </div>
            <div>
              <p className="t-h3">{f.name}</p>
              <p className="mt-1 text-muted">{f.role}</p>
              <ul className="mt-5 grid gap-2 border-t border-line pt-4 text-sm">
                <li className="flex justify-between gap-4"><span>Your story</span><span className="t-label text-orange">Shaped</span></li>
                <li className="flex justify-between gap-4"><span>On camera</span><span className="t-label text-orange">Coached</span></li>
                <li className="flex justify-between gap-4"><span>Posting</span><span className="t-label text-orange">Weekly</span></li>
              </ul>
            </div>
          </div>
        ))}
      </Stage>
    </div>
  );
}

/* Branding: a brand kit that holds together */
const swatches = [
  { name: "Orange", hex: "#F26522", cls: "bg-orange" },
  { name: "Black", hex: "#0B0B0B", cls: "bg-bg border border-line" },
  { name: "White", hex: "#F4F2EE", cls: "bg-fg" },
];
function BrandingVisual({ play }: VisualProps) {
  const ref = useRef<HTMLDivElement>(null);
  usePlay(ref, play, () => {
    gsap.from(".kit", { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: "expo.out" });
  });
  return (
    <div ref={ref} className="h-full">
      <Stage label="Brand kit">
        <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
          <div className="kit flex flex-col justify-between bg-orange p-4 text-on-orange">
            <span className="t-label text-[0.625rem]">Logo</span>
            <span className="font-display text-2xl font-extrabold tracking-[-0.04em] md:text-4xl">yourbrand.</span>
          </div>
          <div className="kit flex flex-col justify-between bg-surface-2 p-4">
            <span className="t-label text-[0.625rem] text-muted">Type</span>
            <span className="font-display text-5xl font-extrabold leading-none tracking-[-0.04em] md:text-6xl">Aa</span>
          </div>
          <div className="kit col-span-2 grid grid-cols-3 gap-2">
            {swatches.map((s) => (
              <div key={s.name} className="flex flex-col gap-1.5">
                <div className={`min-h-0 flex-1 ${s.cls}`} />
                <p className="flex justify-between text-xs">
                  <span className="font-bold">{s.name}</span>
                  <span className="font-mono text-muted">{s.hex}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </Stage>
    </div>
  );
}

export const visuals: Record<ServiceKey, (p: VisualProps) => React.JSX.Element> = {
  social: SocialVisual,
  content: ContentVisual,
  influencer: InfluencerVisual,
  video: VideoVisual,
  personal: PersonalVisual,
  branding: BrandingVisual,
};
