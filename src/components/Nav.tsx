"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { List, WhatsappLogo, X } from "@phosphor-icons/react";
import { services, tagged, work } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { whatsappLink } from "@/lib/site";
import { Logo } from "./Logo";

// Each link carries a count, like a notification badge: the header tells you
// what is inside before you click.
const links = [
  { href: "/#services", label: "Services", count: services.length },
  { href: "/#work", label: "Work", count: work.length },
  { href: "/#clients", label: "Clients", count: tagged.length },
];

const Badge = ({ n, big = false }: { n: number; big?: boolean }) => (
  <span
    aria-hidden
    className={`inline-grid place-items-center bg-orange font-bold tabular-nums text-[#1c1c1b] ${
      big ? "ml-3 h-8 min-w-8 px-2 align-super text-base" : "ml-1.5 h-[1.15rem] min-w-[1.15rem] px-1 align-super text-[0.6875rem]"
    }`}
  >
    {n}
  </span>
);

export function Nav() {
  const header = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Past the top, the header turns ink; the link for the section in view is underlined.
  useGSAP(
    () => {
      // Stays ink all the way to the bottom (a start/end toggle would switch off at the very end).
      const check = (y: number) => setScrolled(y > 24);
      check(window.scrollY);
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => check(self.scroll()) });
      gsap.fromTo(".nav-progress", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
      links.forEach(({ href }) => {
        const id = href.split("#")[1];
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => setActive((cur) => (self.isActive ? id : cur === id ? null : cur)),
        });
      });
    },
    { scope: header },
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Open menu or scrolled: the dark header.
  const ink = scrolled || open;

  return (
    <header
      ref={header}
      className={`sticky top-0 z-40 border-b transition-colors duration-300 motion-reduce:transition-none ${
        ink ? "theme-ink border-transparent" : "border-line bg-bg"
      }`}
    >
      <nav aria-label="Main" className="wrap flex h-[4.5rem] items-center justify-between">
        <Link href="/" aria-label="JustCliks home" onClick={() => setOpen(false)}>
          <Logo
            height={54}
            priority
            variant={ink ? "light" : "ink"}
            className={`origin-left transition-transform duration-300 ease-out motion-reduce:transition-none ${scrolled ? "scale-[0.82]" : ""}`}
          />
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active === l.href.split("#")[1] ? "location" : undefined}
                  className="link text-[0.9375rem] font-bold text-fg aria-[current=location]:decoration-orange aria-[current=location]:decoration-[3px]"
                >
                  {l.label}
                  <Badge n={l.count} />
                  <span className="sr-only"> ({l.count})</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp JustCliks" className="btn btn-ghost h-10 px-3">
                <WhatsappLogo size={20} weight="bold" aria-hidden />
              </a>
            )}
            <Link href="/#contact" className="btn btn-primary h-10 px-4 text-sm">
              Start a project
            </Link>
          </div>
        </div>

        <button
          type="button"
          className="-mr-2 flex items-center gap-2 p-2 text-sm font-bold md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden>{open ? "Close" : "Menu"}</span>
          {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
        </button>
      </nav>
      <span aria-hidden className="nav-progress absolute inset-x-0 -bottom-px h-[3px] origin-left scale-x-0 bg-orange" />

      {/* Phones: a full-screen menu in ink, big links with their counts */}
      {open && (
        <div id="mobile-menu" className="theme-ink wrap fixed inset-x-0 bottom-0 top-[4.5rem] flex flex-col justify-between pb-8 pt-6 md:hidden">
          <ul className="flex flex-col">
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-line">
                <Link href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-5">
                  <span className="t-label text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="t-h2">{l.label}</span>
                  <Badge n={l.count} big />
                </Link>
              </li>
            ))}
          </ul>
          <div className="grid gap-3">
            <p className="text-sm text-muted">Social media, content, branding, creator campaigns and video.</p>
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-ink h-14 w-full">
                <WhatsappLogo size={20} weight="bold" aria-hidden />
                WhatsApp us
              </a>
            )}
            <Link href="/#contact" onClick={() => setOpen(false)} className="btn btn-primary h-14 w-full">
              Start a project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
