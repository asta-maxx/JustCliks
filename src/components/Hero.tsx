"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { noisePosts } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { FeedCard, PostFrame } from "./FeedCard";
import { Logo } from "./Logo";
import { FeedWall } from "./FeedWall";

const introFeed = noisePosts.map((title, i) => ({
  kind: "noise" as const,
  title,
  tag: i % 3 === 1 ? "Sponsored" : "Suggested",
  tone: "paper" as const,
}));

const ARROW = (
  <svg aria-hidden viewBox="0 0 120 80" className="ml-[0.12em] inline-block h-[0.9em] w-[1.35em] overflow-visible align-[-0.04em]">
    <path className="growth-line" d="M4 74 C 40 72, 72 56, 96 22" fill="none" stroke="var(--orange)" strokeWidth="11" />
    <polygon className="growth-head" points="80,14 116,0 112,38" fill="var(--orange)" />
  </svg>
);

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
            .fromTo(".intro-flash", { opacity: 0.95 }, { opacity: 0, duration: 0.5, ease: "power2.out", immediateRender: false })
            .fromTo(".intro-stop", { scale: 1.08 }, { scale: 1, duration: 0.6, ease: "expo.out", immediateRender: false }, "<")
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

        // The logo's orange marker sweeps under "stop", then its growth arrow draws up out of it.
        const arrows = gsap.utils.toArray<SVGPathElement>(".growth-line");
        tl.fromTo(".hero-mark", { "--mark": 0 }, { "--mark": 1, duration: 0.5, ease: "power3.out", immediateRender: false }, "-=0.5");
        arrows.forEach((arrow, i) => {
          const len = arrow.getTotalLength() || 140;
          tl.fromTo(arrow, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut", immediateRender: false }, i ? "<" : ">");
        });
        tl.fromTo(".growth-head", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, ease: "back.out(3)", immediateRender: false }, "-=0.15");

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
            <div className="intro-stop aspect-[4/5] w-full shrink-0">
              <PostFrame className="bg-fg text-bg">
                <p className="t-label text-[3.6cqw] text-orange">Worth the stop</p>
                <Logo height={150} variant="light" className="!h-auto w-full" />
                <span />
              </PostFrame>
            </div>
          </div>
          <div className="intro-flash pointer-events-none absolute inset-x-0 top-1/2 aspect-[4/5] -translate-y-1/2 bg-flash opacity-0" />
        </div>
        <button
          type="button"
          onClick={() => tlRef.current?.progress(1)}
          className="t-label absolute bottom-6 right-6 border border-line px-3 py-2 text-fg hover:bg-fg hover:text-bg"
        >
          Skip intro
        </button>
      </div>

      {/* One centred stage: the headline, then the wall of feeds it is about,
          then the controls and the pitch. Same order on every screen. */}
      <div className="wrap flex min-h-[calc(100svh-4.5rem)] flex-col justify-center pb-10 pt-6 sm:pt-10 lg:pb-8">
        {/* Who we are, in one plain line */}
        <p className="hero-in t-label mx-auto text-center text-orange-ink">
          <span className="sm:hidden">Social media agency, Tamil Nadu</span>
          <span className="hidden sm:inline">Social media &amp; content agency, Tamil Nadu</span>
        </p>

        {/* Line breaks are set per screen so no word is ever left alone:
            three lines on phones, two from tablet up. */}
        <h1 id="hero-title" className="hero-in t-display mx-auto mt-4 text-center text-[clamp(2.4rem,5vw,4.6rem)]">
          <span className="sr-only">We make the posts people stop scrolling for.</span>
          <span aria-hidden className="block sm:hidden">
            <span className="block">We make the posts</span>
            <span className="block">
              people <span className="mark hero-mark">stop</span>
            </span>
            <span className="block">
              scrolling for.
              {ARROW}
            </span>
          </span>
          <span aria-hidden className="hidden sm:block">
            <span className="block">We make the posts people</span>
            <span className="block whitespace-nowrap">
              <span className="mark hero-mark">stop</span> scrolling for.
              {ARROW}
            </span>
          </span>
        </h1>

        {/* What we do, said plainly, and the next step */}
        <p className="hero-in t-lead mx-auto mt-5 max-w-[50ch] text-center">
          We plan, shoot and post content for restaurants, caterers, creators and founders, so your brand is the one
          people stop for.
        </p>
        <div className="hero-in mt-7 flex flex-wrap justify-center gap-3">
          <Link href="#contact" className="btn btn-primary">
            Start a project
          </Link>
          <Link href="#work" className="btn btn-ghost">
            See the work
          </Link>
        </div>

        <div className="hero-in mt-10 sm:mt-12">
          <FeedWall />
        </div>
      </div>
    </section>
  );
}
