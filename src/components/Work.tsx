"use client";

import { useRef } from "react";
import { work } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { MediaSlot } from "./MediaSlot";
import { Poster } from "./Poster";

const PAN = `(min-width: 1024px) and ${MOTION_OK}`;

// Desktop: vertical scroll pans the reel sideways, like scrubbing a timeline.
// Smaller screens: native swipe with snap points.
export function Work() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(PAN, () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: wrap },
  );

  return (
    <section
      ref={wrap}
      id="work"
      aria-labelledby="work-title"
      className="scroll-mt-16 overflow-hidden lg:h-[100dvh]"
    >
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 py-20 md:px-8 lg:h-full lg:snap-none lg:items-center lg:gap-8 lg:overflow-visible lg:py-0 lg:pt-16 motion-reduce:lg:overflow-x-auto"
      >
        <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-end md:w-[46vw] lg:w-[30vw] lg:self-stretch lg:pb-[14dvh]">
          <h2 id="work-title" className="type-mass text-[16vw] md:text-[6rem] lg:text-[6vw]">
            The reel.
          </h2>
          <p className="mt-5 max-w-[30ch] text-lg leading-relaxed text-muted">
            Music videos, film promotions, feeds and faces. Scroll through a few of our projects.
          </p>
        </div>

        {work.map((w) => (
          <article key={w.title} className="w-[78vw] shrink-0 snap-start md:w-[42vw] lg:w-auto">
            <div className="aspect-[4/5] w-full lg:h-[64dvh] lg:w-auto">
              {w.media ? (
                <MediaSlot media={w.media} alt={`${w.title}, ${w.detail}`} />
              ) : (
                <Poster title={w.title} tone={w.tone} tamil={w.tamil} />
              )}
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-3 lg:max-w-[calc(64dvh*0.8)]">
              <h3 className="type-label shrink-0">{w.service}</h3>
              <p className="truncate text-right text-sm text-muted">{w.detail}</p>
            </div>
          </article>
        ))}
        <div aria-hidden className="w-px shrink-0 lg:w-[4vw]" />
      </div>
    </section>
  );
}
