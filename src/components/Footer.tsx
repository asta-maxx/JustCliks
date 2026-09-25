import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { FooterCredit } from "./FooterCredit";
import { Logo } from "./Logo";
import { ScrollMeter } from "./ScrollMeter";

// A dark sign-off: the light page ends on an ink block with the logo large.
export function Footer() {
  const socials = [
    { label: "Instagram", href: site.instagram },
    { label: "YouTube", href: site.youtube },
    { label: "WhatsApp", href: whatsappLink },
  ].filter((s) => s.href);

  const contact = [
    site.email && { label: site.email, href: `mailto:${site.email}` },
    site.phone && { label: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
  ].filter(Boolean) as { label: string; href: string }[];

  const hasContact = contact.length > 0 || socials.length > 0;

  return (
    <footer className="theme-ink">
      {/* The hook: how far you scrolled to get here */}
      <div className="wrap pb-16 pt-20 md:pb-24 md:pt-28">
        <ScrollMeter />
      </div>

      <div className="wrap">
      <div className="grid gap-14 border-t border-line pb-14 pt-14 md:pb-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Link href="/" aria-label="JustCliks home" className="inline-block">
            <Logo height={110} variant="light" />
          </Link>
          <p className="t-h3 mt-6 max-w-[18ch]">Made to stop the scroll.</p>
          <p className="mt-3 max-w-[40ch] text-muted">
            Content, social media, branding, influencer marketing and video production.
          </p>
          {site.address && <p className="mt-4 max-w-[34ch] text-sm text-muted">{site.address}</p>}
        </div>

        <div className={`grid gap-10 self-end sm:grid-cols-3 lg:col-span-6 ${hasContact ? "" : "sm:grid-cols-2 lg:col-span-4 lg:col-start-9"}`}>
          <nav aria-label="Footer">
            <p className="t-label text-muted">Site</p>
            <ul className="mt-4 grid gap-2 whitespace-nowrap font-bold">
              <li><Link className="link" href="/#services">Services</Link></li>
              <li><Link className="link" href="/#work">Work</Link></li>
              <li><Link className="link" href="/#clients">Clients</Link></li>
              <li><Link className="link" href="/#contact">Start a project</Link></li>
            </ul>
          </nav>

          <div>
            <p className="t-label text-muted">Legal</p>
            <ul className="mt-4 grid gap-2 whitespace-nowrap font-bold">
              <li><Link className="link" href="/privacy">Privacy policy</Link></li>
              <li><Link className="link" href="/terms">Terms of service</Link></li>
            </ul>
          </div>

          {hasContact && (
            <div>
              <p className="t-label text-muted">Contact</p>
              <ul className="mt-4 grid gap-2 whitespace-nowrap font-bold">
                {contact.map((c) => (
                  <li key={c.href}><a className="link" href={c.href}>{c.label}</a></li>
                ))}
                {socials.map((s) => (
                  <li key={s.label}><a className="link" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      </div>

      <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line py-6 text-sm text-muted">
          <p>© {new Date().getFullYear()} JustCliks. All rights reserved.</p>
          <FooterCredit />
        </div>
      </div>
    </footer>
  );
}
