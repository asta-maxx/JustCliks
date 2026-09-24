import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { CreditsRoll } from "./CreditsRoll";

// End credits.
export function Footer() {
  const socials = [
    { label: "Instagram", href: site.instagram },
    { label: "YouTube", href: site.youtube },
    { label: "WhatsApp", href: whatsappLink },
  ].filter((s) => s.href);

  return (
    <footer className="overflow-hidden border-t border-line bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 pt-32 md:px-8 md:pt-48">
        <CreditsRoll />

        <div className="mt-32 grid grid-cols-2 gap-10 border-t border-line pt-10 md:grid-cols-12">
          <nav aria-label="Footer" className="md:col-span-3">
            <ul className="flex flex-col gap-2 font-semibold">
              <li><Link className="link" href="/#services">Services</Link></li>
              <li><Link className="link" href="/#work">Work</Link></li>
              <li><Link className="link" href="/#clients">Cast</Link></li>
              <li><Link className="link" href="/#contact">Book a slot</Link></li>
            </ul>
          </nav>
          <div className="md:col-span-3">
            <ul className="flex flex-col gap-2 font-semibold">
              <li><Link className="link" href="/privacy">Privacy policy</Link></li>
              <li><Link className="link" href="/terms">Terms of service</Link></li>
            </ul>
          </div>
          {(socials.length > 0 || site.email || site.phone) && (
            <div className="col-span-2 md:col-span-4 md:col-start-9">
              <ul className="flex flex-col gap-2 font-semibold">
                {site.email && <li><a className="link" href={`mailto:${site.email}`}>{site.email}</a></li>}
                {site.phone && <li><a className="link" href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></li>}
                {socials.map((s) => (
                  <li key={s.label}><a className="link" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
                ))}
              </ul>
              {site.address && <p className="mt-4 max-w-[32ch] text-sm text-muted">{site.address}</p>}
            </div>
          )}
        </div>
      </div>

      <p aria-hidden className="type-mass mt-20 select-none whitespace-nowrap text-center text-[17.6vw] leading-[0.78]">
        Just<span className="text-accent">Cliks</span>
      </p>
      <div className="mx-auto flex max-w-[1400px] flex-wrap justify-between gap-2 px-4 py-6 text-sm text-muted md:px-8">
        <p>© {new Date().getFullYear()} JustCliks. All rights reserved.</p>
        <p>Content, social media, branding and video.</p>
      </div>
    </footer>
  );
}
