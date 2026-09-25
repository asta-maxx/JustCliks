import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { FooterCredit } from "./FooterCredit";
import { FooterIndex } from "./FooterIndex";
import { Logo } from "./Logo";
import { ScrollMeter } from "./ScrollMeter";

// A dark sign-off: the scroll meter, a big site index, then the fine print.
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

  return (
    <footer className="theme-ink overflow-x-clip">
      {/* The hook: how far you scrolled to get here */}
      <div className="wrap pb-16 pt-20 md:pb-24 md:pt-28">
        <ScrollMeter />
      </div>

      <div className="wrap">
        <div className="grid gap-12 border-t border-line pb-12 pt-12 md:pb-16 md:pt-14 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col justify-between gap-8 lg:col-span-4">
            <div>
              <Link href="/" aria-label="JustCliks home" className="inline-block">
                <Logo height={96} variant="light" />
              </Link>
              <p className="t-h3 mt-6 max-w-[16ch]">Made to stop the scroll.</p>
              <p className="mt-3 max-w-[36ch] text-muted">
                Content, social media, branding, influencer marketing and video production.
              </p>
              {site.address && <p className="mt-4 max-w-[34ch] text-sm text-muted">{site.address}</p>}
            </div>
            {(contact.length > 0 || socials.length > 0) && (
              <ul className="flex flex-wrap gap-x-5 gap-y-2 font-bold">
                {contact.map((c) => (
                  <li key={c.href}>
                    <a className="link" href={c.href}>{c.label}</a>
                  </li>
                ))}
                {socials.map((s) => (
                  <li key={s.label}>
                    <a className="link" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <FooterIndex />
          </div>
        </div>
      </div>

      {/* The fine print, and who built it */}
      <div className="wrap">
        <div className="grid gap-5 border-t border-line py-6 text-sm text-muted md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p>© {new Date().getFullYear()} JustCliks. All rights reserved.</p>
            <Link className="link font-bold text-fg" href="/privacy">
              Privacy policy
            </Link>
            <Link className="link font-bold text-fg" href="/terms">
              Terms of service
            </Link>
          </div>
          <FooterCredit />
        </div>
      </div>
    </footer>
  );
}
