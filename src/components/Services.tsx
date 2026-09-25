"use client";

import { useRef, useState } from "react";
import { services, type Service } from "@/lib/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { visuals } from "./ServiceVisuals";

const N = services.length;
const PIN = `(min-width: 1024px) and ${MOTION_OK}`;
const num = (i: number) => String(i + 1).padStart(2, "0");

function Detail({ s }: { s: Service }) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-8 md:gap-8">
      <div className="md:col-span-5">
        <h3 className="t-h3">{s.name}</h3>
        <p className="mt-3 max-w-[46ch] text-muted">{s.line}</p>
      </div>
      <div className="md:col-span-3">
        {s.clients.length > 0 ? (
          <>
            <p className="t-label text-muted">Done for</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {s.clients.map((c) => (
                <li key={c} className="border border-line px-2.5 py-1 text-[0.8125rem] font-bold">
                  {c}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="t-label text-muted">Where it shows up</p>
            <p className="mt-3 text-[0.9375rem] font-bold">{s.note}</p>
          </>
        )}
      </div>
    </div>
  );
}

// Plays its visual only while it is on screen (mobile stack).
function MobileBlock({ s, i }: { s: Service; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const Visual = visuals[s.key];
  useGSAP(() => {
    ScrollTrigger.create({ trigger: ref.current, start: "top 75%", once: true, onEnter: () => setInView(true) });
  }, { scope: ref });
  return (
    <article ref={ref} className="min-w-0 border-t border-line pt-6">
      <p className="t-label text-orange-ink">{num(i)}</p>
      <div className="mt-4 aspect-[4/3] border border-line bg-surface sm:aspect-[16/10]">
        <Visual play={inView} />
      </div>
      <div className="mt-6">
        <Detail s={s} />
      </div>
    </article>
  );
}

// Desktop: the block pins and scrolling steps through the six services, each
// with its own live visual. Mobile: a stack of the same blocks.
export function Services() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(false);

  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: pin.current, start: "top 70%", once: true, onEnter: () => setSeen(true) });
      const mm = gsap.matchMedia();
      mm.add(PIN, () => {
        st.current = ScrollTrigger.create({
          trigger: pin.current,
          start: "top top+=72",
          end: () => `+=${window.innerHeight * 0.55 * (N - 1)}`,
          pin: true,
          snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.45 }, ease: "power2.inOut" },
          onUpdate: (self) => setActive(Math.round(self.progress * (N - 1))),
        });
        return () => {
          st.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".svc-detail", { y: 16, autoAlpha: 0, duration: 0.5, ease: "expo.out" });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [active] },
  );

  const go = (i: number) => {
    const t = st.current;
    if (!t) return setActive(i);
    window.scrollTo({ top: t.start + (t.end - t.start) * (i / (N - 1)), behavior: "smooth" });
  };

  const s = services[active];
  const Visual = visuals[s.key];

  return (
    <section ref={root} id="services" aria-labelledby="services-title" className="theme-ink scroll-mt-[4.5rem]">
      <div className="wrap pt-24 md:pt-32">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="services-title" className="t-h2 lg:col-span-6">
            Six ways we get you noticed.
          </h2>
          <p className="t-lead self-end lg:col-span-4 lg:col-start-9">Pick one, or hand us the lot. Every service comes with the same crew.</p>
        </div>
      </div>

      {/* Desktop */}
      <div ref={pin} className="hidden lg:block">
        <div className="wrap grid h-[calc(100svh-4.5rem)] grid-cols-12 content-center gap-10 py-10 pb-16">
          <ol className="col-span-4 self-center border-t border-line">
            {services.map((svc, i) => (
              <li key={svc.key} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === active ? "true" : undefined}
                  className={`flex w-full items-baseline gap-4 py-4 text-left ${i === active ? "text-fg" : "text-muted hover:text-fg"}`}
                >
                  <span className={`t-label ${i === active ? "text-orange-ink" : ""}`}>{num(i)}</span>
                  <span className="font-display text-[1.375rem] font-extrabold tracking-[-0.02em]">{svc.name}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="col-span-8 flex flex-col gap-7">
            <div className="h-[min(50svh,440px)] w-full border border-line bg-surface">
              <Visual key={s.key} play={seen} />
            </div>
            <div className="svc-detail">
              <Detail s={s} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile, tablet */}
      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-14 pb-24 pt-12 md:pb-32 lg:hidden">
        {services.map((svc, i) => (
          <MobileBlock key={svc.key} s={svc} i={i} />
        ))}
      </div>
    </section>
  );
}
