"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { Logo } from "./Logo";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#clients", label: "Clients" },
];

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
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <nav aria-label="Main" className="wrap flex h-[4.5rem] items-center justify-between">
        <Link href="/" aria-label="JustCliks home" className="text-[1.3rem]">
          <Logo />
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link text-[0.9375rem] font-bold text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/#contact" className="btn btn-primary h-10 px-4 text-sm">
            Start a project
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
          {open ? <X size={26} weight="bold" /> : <List size={26} weight="bold" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="wrap fixed inset-x-0 bottom-0 top-[4.5rem] flex flex-col justify-between bg-bg pb-8 pt-8 md:hidden">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href} className="border-b border-line">
                <Link href={l.href} onClick={() => setOpen(false)} className="t-h2 block py-4">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/#contact" onClick={() => setOpen(false)} className="btn btn-primary h-14 w-full">
            Start a project
          </Link>
        </div>
      )}
    </header>
  );
}
