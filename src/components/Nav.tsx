"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { clients } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Logo } from "./Logo";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#clients", label: "Cast" },
];

// A theatre board. Each client name clatters in like a split-flap display.
function NowShowing() {
  const box = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ repeat: -1, delay: 3 });
        clients.slice(1).concat(clients[0]).forEach((name) => {
          tl.to(".board", {
            duration: 0.9,
            scrambleText: { text: name.toUpperCase(), chars: "upperCase", speed: 0.5, revealDelay: 0.35 },
            ease: "none",
          }, "+=2.2");
        });
      });
      return () => mm.revert();
    },
    { scope: box },
  );

  return (
    <div ref={box} className="hidden min-w-0 items-center gap-3 xl:flex">
      <span className="type-label shrink-0 bg-accent px-2 py-1 text-on-accent">Now showing</span>
      <p aria-live="off" className="board type-credit w-[20rem] truncate text-[1.5rem] text-ink">
        {clients[0].toUpperCase()}
      </p>
    </div>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 md:px-8"
      >
        <Link href="/" aria-label="JustCliks home" className="shrink-0 text-[1.9rem]">
          <Logo />
        </Link>

        <NowShowing />

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="link text-[0.95rem] font-bold">
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="ticket-x btn btn-primary h-10 px-6 text-[0.95rem] [--bite:7px]"
          >
            Book a slot
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={28} weight="bold" /> : <List size={28} weight="bold" />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 flex flex-col justify-between bg-paper px-4 pb-8 pt-6 md:hidden"
        >
          <ul className="flex flex-col gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="type-mass block py-2 text-[3.6rem]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="btn btn-primary h-14 w-full text-base"
          >
            Book a slot
          </Link>
        </div>
      )}
    </header>
  );
}
