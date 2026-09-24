"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { noisePosts } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { FeedCard } from "./FeedCard";
import { ScrollStopper } from "./ScrollStopper";

const introFeed = noisePosts.map((title, i) => ({
  kind: "noise" as const,
  title,
  tag: i % 3 === 1 ? "Sponsored" : "Suggested",
  tone: "paper" as const,
}));

// First visit: a feed of generic posts blurs past and brakes hard on one
// orange post. Flash, and the page opens. Later visits skip straight in.
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const seen = html.dataset.introSeen === "1";
        const tl = gsap.timeline();
        tlRef.current = tl;

        if (!seen) {
          html.dataset.introPlaying = "1";
          const win = root.current!.querySelector<HTMLElement>(".intro-win")!;
          const track = root.current!.querySelector<HTMLElement>(".intro-track")!;
          const blur = root.current!.querySelector<SVGFEGaussianBlurElement>("#iblur feGaussianBlur")!;
          const cards = track.children;
          const last = cards[cards.length - 1] as HTMLElement;
          const endY = win.clientHeight / 2 - (last.offsetTop + last.offsetHeight / 2);
          const startY = win.clientHeight / 2 - (cards[0] as HTMLElement).offsetHeight / 2;
          let prevY = startY;
          let prevT = performance.now();

          gsap.set(track, { y: startY });
          tl.to(track, {
            y: endY,
            duration: 2,
            ease: "expo.inOut",
            onUpdate() {
              const y = gsap.getProperty(track, "y") as number;
              const now = performance.now();
              const speed = Math.abs(y - prevY) / Math.max((now - prevT) / 1000, 0.001);
              prevY = y;
              prevT = now;
              blur.setAttribute("stdDeviation", `0 ${Math.min(speed / 220, 18).toFixed(2)}`);
            },
            onComplete: () => blur.setAttribute("stdDeviation", "0 0"),
          })
            .fromTo(".intro-flash", { opacity: 0.95 }, { opacity: 0, duration: 0.5, ease: "power2.out" })
            .fromTo(".intro-stop", { scale: 1.08 }, { scale: 1, duration: 0.6, ease: "expo.out" }, "<")
            .to(".intro", { yPercent: -100, duration: 0.85, ease: "expo.inOut" }, "+=0.35")
            .set(".intro", { display: "none" })
            .call(() => {
              html.dataset.introSeen = "1";
              delete html.dataset.introPlaying;
              try {
                sessionStorage.setItem("jc-intro", "1");
              } catch {}
            });
        }

        tl.from(".hero-in", { y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: "expo.out" }, seen ? 0 : "-=0.45");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && document.documentElement.dataset.introPlaying) tlRef.current?.progress(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative">
      {/* Intro */}
      <div aria-hidden className="intro fixed inset-0 z-50 overflow-hidden bg-bg">
        <svg className="absolute size-0">
          <filter id="iblur" x="0" y="-20%" width="100%" height="140%">
            <feGaussianBlur stdDeviation="0 0" />
          </filter>
        </svg>
        <div className="intro-win relative mx-auto h-full w-[min(300px,70vw)]">
          <div className="intro-track absolute inset-x-0 top-0 flex flex-col gap-3 [filter:url(#iblur)]">
            {introFeed.concat(introFeed).map((item, i) => (
              <div key={i} className="aspect-[4/5] w-full shrink-0">
                <FeedCard item={item} />
              </div>
            ))}
            <div className="intro-stop @container flex aspect-[4/5] w-full shrink-0 flex-col justify-between bg-orange p-[8cqw] text-on-orange">
              <p className="t-label text-[3.4cqw]">JustCliks</p>
              <p className="font-display text-[17cqw] font-extrabold leading-[0.98] tracking-[-0.035em]">
                Worth the stop.
              </p>
            </div>
          </div>
          <div className="intro-flash pointer-events-none absolute inset-x-0 top-1/2 aspect-[4/5] -translate-y-1/2 bg-fg opacity-0" />
        </div>
        <button
          type="button"
          onClick={() => tlRef.current?.progress(1)}
          className="t-label absolute bottom-6 right-6 border border-line px-3 py-2 text-fg hover:bg-fg hover:text-bg"
        >
          Skip intro
        </button>
      </div>

      <div className="wrap grid min-h-[calc(100svh-4.5rem)] grid-cols-1 items-center gap-14 py-16 lg:grid-cols-12 lg:gap-10 lg:py-12">
        <div className="lg:col-span-6">
          <h1 id="hero-title" className="hero-in t-display max-w-[13ch]">
            We make the posts people <span className="text-orange">stop</span> scrolling for.
          </h1>
          <p className="hero-in t-lead mt-6 max-w-[44ch]">
            Content, social media, branding, influencer campaigns and video for restaurants, caterers, creators and
            founders.
          </p>
          <div className="hero-in mt-9 flex flex-wrap gap-3">
            <Link href="#contact" className="btn btn-primary">
              Start a project
            </Link>
            <Link href="#work" className="btn btn-ghost">
              See the work
            </Link>
          </div>
        </div>
        <div className="hero-in lg:col-span-6">
          <ScrollStopper />
        </div>
      </div>
    </section>
  );
}
