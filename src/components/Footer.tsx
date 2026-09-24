import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { Logo } from "./Logo";

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
    <footer className="border-t border-line">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12 md:gap-10 md:py-20">
        <div className="md:col-span-5">
          <Link href="/" aria-label="JustCliks home" className="text-[1.5rem]">
            <Logo />
          </Link>
          <p className="mt-4 max-w-[34ch] text-muted">
            Content, social media, branding, influencer marketing and video production.
          </p>
          {site.address && <p className="mt-4 max-w-[34ch] text-sm text-muted">{site.address}</p>}
        </div>

        <nav aria-label="Footer" className="md:col-span-2 md:col-start-7">
          <p className="t-label text-dim">Site</p>
          <ul className="mt-4 grid gap-2 font-bold">
            <li><Link className="link" href="/#services">Services</Link></li>
            <li><Link className="link" href="/#work">Work</Link></li>
            <li><Link className="link" href="/#clients">Clients</Link></li>
            <li><Link className="link" href="/#contact">Start a project</Link></li>
          </ul>
        </nav>

        <div className="md:col-span-2">
          <p className="t-label text-dim">Legal</p>
          <ul className="mt-4 grid gap-2 font-bold">
            <li><Link className="link" href="/privacy">Privacy policy</Link></li>
            <li><Link className="link" href="/terms">Terms of service</Link></li>
          </ul>
        </div>

        {(contact.length > 0 || socials.length > 0) && (
          <div className="md:col-span-2">
            <p className="t-label text-dim">Contact</p>
            <ul className="mt-4 grid gap-2 font-bold">
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

      <div className="wrap flex flex-wrap items-center justify-between gap-3 border-t border-line py-6 text-sm text-muted">
        <p>© {new Date().getFullYear()} JustCliks. All rights reserved.</p>
        <p>Made to stop the scroll.</p>
      </div>
    </footer>
  );
}
