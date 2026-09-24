import { clients } from "@/lib/content";

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {clients.map((c) => (
        <li key={c} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-[1.5rem] font-extrabold tracking-[-0.02em] md:text-[1.875rem]">
            {c}
          </span>
          <span aria-hidden className="size-2 bg-orange" />
        </li>
      ))}
    </ul>
  );
}

export function ClientBand() {
  return (
    <section id="clients" aria-labelledby="clients-title" className="scroll-mt-[4.5rem] border-y border-line py-7">
      <h2 id="clients-title" className="wrap t-label text-muted">
        Brands and people we work with
      </h2>
      <div className="mt-5 overflow-hidden">
        <div className="marquee-track flex w-max motion-reduce:w-auto motion-reduce:flex-wrap">
          <Row />
          <div className="motion-reduce:hidden">
            <Row hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
