import Link from "next/link";
import { site } from "@/lib/site";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <header className="lg:col-span-4">
            <h1 className="type-mass text-[14vw] md:text-[5rem] lg:sticky lg:top-24">{title}</h1>
            <p className="type-label mt-6 text-muted">Last updated {site.legalUpdated}</p>
          </header>
          <article className="legal max-w-[68ch] text-lg leading-relaxed lg:col-span-7 lg:col-start-6 [&_a]:font-semibold [&_a]:underline [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-[square] [&_ul]:pl-6 [&_ul_li::marker]:text-accent">
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
