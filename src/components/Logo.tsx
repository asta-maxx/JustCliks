export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`type-mass inline-flex items-center gap-2 tracking-[-0.02em] ${className}`}>
      <span aria-hidden className="inline-block size-[0.6em] bg-accent" />
      <span>
        Just<span className="text-accent">Cliks</span>
      </span>
    </span>
  );
}
