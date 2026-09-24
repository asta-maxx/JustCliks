"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

const FilmReel = dynamic(() => import("./FilmReel"), { ssr: false });

const services = [
  "Content creation",
  "Social media management",
  "Branding",
  "Personal branding",
  "Influencer marketing",
  "Video production",
];

const slammed = () => {
  document.documentElement.dataset.slammed = "1";
  window.dispatchEvent(new Event("jc:slam"));
};

// First visit: film-leader countdown, "JustCliks presents", then the film loop
// spins in and the title slams down with a flash and a camera shake.
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
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
          const sweep = root.current!.querySelector<HTMLElement>(".leader-sweep");
          gsap.utils.toArray<HTMLElement>(".leader-n").forEach((n) => {
            tl.set(n, { autoAlpha: 1 })
              .fromTo(sweep, { "--sweep": "0deg" }, { "--sweep": "360deg", duration: 0.46, ease: "none" })
              .set(n, { autoAlpha: 0 });
          });
          const presents = SplitText.create(".presents", { type: "chars" });
          tl.set(".leader", { autoAlpha: 0 })
            .set(".presents", { autoAlpha: 1 })
            .from(presents.chars, { autoAlpha: 0, yPercent: 80, duration: 0.4, stagger: 0.022, ease: "expo.out" })
            .to(".presents", { autoAlpha: 0, duration: 0.15 }, "+=0.4")
            .to(".intro", { autoAlpha: 0, duration: 0.25 })
            .set(".intro", { display: "none" })
            .call(() => {
              html.dataset.introSeen = "1";
              delete html.dataset.introPlaying;
              try {
                sessionStorage.setItem("jc-intro", "1");
              } catch {}
            });
        }

        // The mass entry.
        tl.call(slammed)
          .from(".slam", { scale: 2.4, autoAlpha: 0, duration: 0.45, ease: "power4.in", stagger: 0.14 })
          .fromTo(".hero-flash", { opacity: 0.8 }, { opacity: 0, duration: 0.6, ease: "power2.out" })
          .to(
            ".hero-shake",
            { keyframes: { x: [-14, 11, -7, 5, -2, 0], y: [6, -6, 4, -2, 1, 0] }, duration: 0.45, ease: "none" },
            "<",
          )
          .from(".hero-fade", { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.09, ease: "expo.out" }, "-=0.25");

        // Leaving the hero: the title drifts up and dims while the reel pushes in.
        gsap.to(".hero-shake", {
          yPercent: -18,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", slammed);
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
    <section ref={root} aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Intro: film leader */}
      <div aria-hidden className="intro fixed inset-0 z-50 grid place-items-center bg-[#070605] text-ink">
        <div className="leader relative grid size-[min(70vw,70vh)] place-items-center">
          <div className="leader-sweep absolute inset-0 rounded-full" />
          <div className="absolute inset-[5%] rounded-full border-2 border-ink/45" />
          <div className="absolute inset-[15%] rounded-full border border-ink/25" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-ink/25" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-ink/25" />
          {[3, 2, 1].map((n) => (
            <span key={n} className="leader-n type-mass invisible absolute text-[min(36vw,36vh)] leading-none">
              {n}
            </span>
          ))}
        </div>
        <p className="presents type-credit invisible absolute text-center text-[clamp(1.4rem,3vw,2.6rem)] tracking-[0.3em] text-ink">
          JustCliks presents
        </p>
        <button
          type="button"
          onClick={() => tlRef.current?.progress(1)}
          className="type-label absolute bottom-6 right-6 border border-ink/40 px-3 py-2 text-ink hover:bg-ink hover:text-paper"
        >
          Skip intro
        </button>
      </div>

      <FilmReel trigger={root} anchor={title} />
      <div aria-hidden className="hero-flash pointer-events-none absolute inset-0 z-10 bg-[var(--flash)] opacity-0" />

      <div className="hero-shake relative z-[1] mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1400px] flex-col px-4 pb-8 pt-10 md:px-8 md:pb-10">
        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center md:py-10">
          <h1
            ref={title}
            id="hero-title"
            className="type-mass text-[19.5vw] md:text-[13vw] lg:text-[11.2vw] 2xl:text-[10.5rem]"
          >
            <span className="slam block">Stop the</span>
            <span className="slam block text-accent">scroll.</span>
          </h1>
        </div>

        {/* Bottom of the poster: the billing block, built from the real service list, and the CTAs */}
        <div className="grid items-end gap-8 border-t border-line pt-6 lg:grid-cols-12 lg:gap-6">
          <div className="hero-fade type-credit text-[1.05rem] leading-[1.12] text-muted md:text-[1.3rem] lg:col-span-8">
            <p>
              In association with <span className="text-[1.45em] text-ink">your brand</span>&nbsp; a{" "}
              <span className="text-[1.45em] text-ink">JustCliks</span> production
            </p>
            <p className="mt-1 flex flex-wrap gap-x-4">
              {services.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </p>
            <p className="mt-1">
              Starring <span className="text-ink">restaurants, caterers, creators and founders</span>
            </p>
          </div>
          <div className="hero-fade flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <Link href="#contact" className="btn btn-primary">
              Book a slot
            </Link>
            <Link href="#work" className="btn btn-ghost bg-paper">
              Watch the reel
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
