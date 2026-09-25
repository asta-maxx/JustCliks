"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { noisePosts } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { FeedCard, PostFrame } from "./FeedCard";
import { Logo } from "./Logo";
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

        // The logo's orange marker sweeps under "stop", then its growth arrow draws up through the headline.
        const arrow = root.current!.querySelector<SVGPathElement>(".growth-line")!;
        const len = arrow.getTotalLength();
        tl.fromTo(".hero-mark", { "--mark": 0 }, { "--mark": 1, duration: 0.5, ease: "power3.out", immediateRender: false }, "-=0.5")
          .fromTo(arrow, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, "-=0.1")
          .fromTo(".growth-head", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, ease: "back.out(3)", immediateRender: false }, "-=0.15");

        // Then the logo's cursor glides over and clicks Clik, stopping the feed.
        tl.call(() => {
          const btn = root.current!.querySelector<HTMLElement>("[data-clik]");
          const cursor = root.current!.querySelector<HTMLElement>(".brand-cursor");
          const ripple = root.current!.querySelector<HTMLElement>(".click-ripple");
          if (!btn || !cursor || !ripple || btn.offsetParent === null) return;
          const box = root.current!.getBoundingClientRect();
          const b = btn.getBoundingClientRect();
          const tx = b.left - box.left + b.width * 0.62;
          const ty = b.top - box.top + b.height * 0.55;
          gsap
            .timeline()
            .fromTo(cursor, { x: tx - 260, y: ty + 220, autoAlpha: 0 }, { x: tx, y: ty, autoAlpha: 1, duration: 1.1, ease: "power3.inOut" })
            .to(cursor, { scale: 0.8, duration: 0.09, yoyo: true, repeat: 1, transformOrigin: "0 0" })
            .call(() => window.dispatchEvent(new Event("jc:clik")))
            .fromTo(ripple, { x: tx - 18, y: ty - 18, scale: 0.3, autoAlpha: 1 }, { scale: 1.6, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "<")
            .to(cursor, { x: tx + 90, y: ty + 140, autoAlpha: 0, duration: 0.9, ease: "power2.in" }, "+=0.5");
        }, undefined, "+=0.4");
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

      <div className="wrap grid min-h-[calc(100svh-4.5rem)] grid-cols-1 items-center gap-14 py-16 lg:grid-cols-12 lg:gap-10 lg:py-12">
        <div className="lg:col-span-6">
          <div className="hero-in relative">
            <svg
              aria-hidden
              viewBox="0 0 600 320"
              className="pointer-events-none absolute -top-6 right-5 h-[118%] w-[84%] overflow-visible sm:-right-2 sm:-top-10 sm:h-[125%] sm:w-[92%] md:-right-8"
            >
              <path className="growth-line" d="M4 300 C 170 285, 330 240, 452 118 S 540 38, 560 22" fill="none" stroke="var(--orange)" strokeWidth="14" />
              <polygon className="growth-head" points="530,8 596,0 584,62" fill="var(--orange)" />
            </svg>
            <h1 id="hero-title" className="t-display relative max-w-[13ch]">
              We make the posts people <span className="mark hero-mark">stop</span> scrolling for.
            </h1>
          </div>
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

      {/* The logo's cursor, used once to click the feed to a stop */}
      <svg aria-hidden viewBox="0 0 64 64" className="brand-cursor pointer-events-none absolute left-0 top-0 z-10 size-12 opacity-0">
        <path d="M6 4 L54 20 L34 28 L50 50 L42 58 L26 36 L14 52 Z" fill="var(--fg)" stroke="var(--bg)" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <span aria-hidden className="click-ripple pointer-events-none absolute left-0 top-0 z-10 size-9 border-[3px] border-orange opacity-0" />
    </section>
  );
}
