import { clients } from "@/lib/content";

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {clients.map((c) => (
        <li key={c} className="flex items-center">
          <span className="type-mass whitespace-nowrap px-7 text-[2.2rem] md:text-[3rem]">{c}</span>
          <span aria-hidden className="type-mass text-[2.2rem] text-accent md:text-[3rem]">
            /
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ClientBand() {
  return (
    <section id="clients" aria-labelledby="clients-title" className="scroll-mt-16 border-y border-line py-8">
      <h2 id="clients-title" className="type-label mx-auto max-w-[1400px] px-4 text-muted md:px-8">
        Starring
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
