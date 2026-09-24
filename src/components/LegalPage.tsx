import Link from "next/link";
import { site } from "@/lib/site";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="wrap py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <header className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h1 className="t-h2">{title}</h1>
              <p className="t-label mt-5 text-muted">Last updated {site.legalUpdated}</p>
            </div>
          </header>
          <article className="max-w-[68ch] text-[1.0625rem] leading-relaxed text-fg/90 lg:col-span-7 lg:col-start-6 [&_a]:font-bold [&_a]:text-fg [&_a]:underline [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-[-0.02em] [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-[square] [&_ul]:pl-6 [&_ul_li::marker]:text-orange">
            {children}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function ContactLine() {
  if (site.email) {
    return (
      <>
        email us at <a href={`mailto:${site.email}`}>{site.email}</a> or use the form on our{" "}
        <Link href="/#contact">homepage</Link>
      </>
    );
  }
  return (
    <>
      use the contact form on our <Link href="/#contact">homepage</Link>
    </>
  );
}
