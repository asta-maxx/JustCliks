export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-extrabold tracking-[-0.03em] ${className}`}>
      <span aria-hidden className="grid size-[1.15em] place-items-center bg-orange">
        <span className="size-[0.42em] bg-bg" />
      </span>
      <span>
        Just<span className="text-orange">Cliks</span>
      </span>
    </span>
  );
}
