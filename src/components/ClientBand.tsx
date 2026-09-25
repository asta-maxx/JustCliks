import { tagged } from "@/lib/content";
import { toneClass } from "./Poster";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w) && !["and", "of", "the"].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-3 pr-3">
      {tagged.map((c) => (
        <li key={c.name} className="flex shrink-0 items-center gap-3 border border-line py-2 pl-2 pr-5">
          <span aria-hidden className={`grid size-11 shrink-0 place-items-center font-display text-base font-extrabold ${toneClass[c.tone]}`}>
            {initials(c.name)}
          </span>
          <span className="whitespace-nowrap leading-tight">
            <span className="block font-display text-lg font-extrabold tracking-[-0.02em]">{c.name}</span>
            <span className="block text-xs text-muted">{c.did}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

// Every client, as a moving wall of name tiles.
export function ClientBand() {
  return (
    <section id="clients" aria-labelledby="clients-title" className="scroll-mt-[4.5rem] border-y border-line py-7">
      <div className="wrap flex items-baseline justify-between gap-4">
        <h2 id="clients-title" className="t-label text-muted">
          <span className="sm:hidden">Our clients</span>
          <span className="hidden sm:inline">Brands and people we work with</span>
        </h2>
        <p className="t-label hidden text-muted sm:block">{tagged.length} and counting</p>
      </div>
      <div className="mt-5 overflow-hidden">
        <div className="marquee-track flex w-max motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:gap-y-3">
          <Row />
          <div className="motion-reduce:hidden">
            <Row hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
