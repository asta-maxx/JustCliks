"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { whatsappLink } from "@/lib/site";

// Phones only: once the hero is gone, the next step stays in thumb reach.
// It steps aside when the contact section is on screen.
export function MobileCTA() {
  const root = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useGSAP(() => {
    if (!document.getElementById("clients") || !document.getElementById("contact")) return;
    ScrollTrigger.create({
      trigger: "#clients",
      start: "top 60%",
      endTrigger: "#contact",
      end: "top bottom",
      onToggle: (self) => setShow(self.isActive),
    });
  });

  return (
    <div
      ref={root}
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex gap-2">
        <Link href="#contact" tabIndex={show ? 0 : -1} className="btn btn-primary h-12 flex-1">
          Start a project
        </Link>
        {whatsappLink && (
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" tabIndex={show ? 0 : -1} aria-label="WhatsApp JustCliks" className="btn btn-ink h-12 px-4">
            <WhatsappLogo size={22} weight="bold" aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}
