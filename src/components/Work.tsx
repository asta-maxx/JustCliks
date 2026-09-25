"use client";

import { useRef } from "react";
import { work } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { MediaSlot } from "./MediaSlot";
import { Poster } from "./Poster";

const PAN = `(min-width: 1024px) and ${MOTION_OK}`;

// Desktop: vertical scroll pans the reel sideways. Smaller screens: swipe.
export function Work() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(PAN, () => {
        const distance = () => track.current!.scrollWidth - track.current!.clientWidth;
        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top top+=72",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.to(".work-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: wrap.current, start: "top top+=72", end: () => `+=${distance()}`, scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: wrap },
  );

  return (
    <section ref={wrap} id="work" aria-labelledby="work-title" className="scroll-mt-[4.5rem] overflow-hidden border-t border-line">
      <div className="lg:flex lg:h-[calc(100svh-4.5rem)] lg:flex-col lg:justify-center">
        <div className="wrap grid gap-6 pt-28 lg:grid-cols-12 lg:pt-0">
          <h2 id="work-title" className="t-h2 lg:col-span-6">
            Recent work.
          </h2>
          <p className="t-lead self-end lg:col-span-4 lg:col-start-9">
            Music videos, film promotions, feeds and founders. Real clients, real briefs.
          </p>
        </div>

        <div
          ref={track}
          className="mt-10 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-24 md:scroll-px-10 md:px-10 lg:mt-12 lg:snap-none lg:gap-5 lg:overflow-visible lg:pb-0 xl:px-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]"
        >
          {work.map((w) => (
            <article key={w.title} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[min(21rem,24vw)]">
              <div className="aspect-[4/5] w-full">
                {w.media ? (
                  <MediaSlot media={w.media} alt={`${w.title}, ${w.detail}`} />
                ) : (
                  <Poster title={w.title} tone={w.tone} tamil={w.tamil} />
                )}
              </div>
              <h3 className="mt-4 font-display text-lg font-extrabold tracking-[-0.02em]">{w.title}</h3>
              <p className="mt-1 text-sm text-muted">
                <span className="font-bold text-orange-ink">{w.service}</span> <span className="text-dim">/</span> {w.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="wrap mt-10 hidden lg:block">
          <div className="h-px bg-line">
            <div className="work-progress h-px origin-left scale-x-0 bg-orange" />
          </div>
        </div>
      </div>
    </section>
  );
}
