import type { FeedItem } from "@/lib/content";

const tone = {
  accent: "bg-orange text-on-orange",
  ink: "bg-fg text-bg",
  paper: "bg-surface-2 text-fg",
} as const;

// One post in a feed. Generic posts are flat and grey; client posts are bold.
export function FeedCard({ item }: { item: FeedItem }) {
  if (item.kind === "noise") {
    return (
      <div className="@container flex h-full w-full flex-col justify-between bg-surface p-[8cqw] text-dim">
        <p className="t-label text-[3.4cqw]">{item.tag}</p>
        <p className="font-display text-[11cqw] font-extrabold leading-[1.02] tracking-[-0.03em]">{item.title}</p>
      </div>
    );
  }
  const long = item.title.length > 14;
  return (
    <div className={`@container relative flex h-full w-full flex-col justify-between overflow-hidden p-[8cqw] ${tone[item.tone]}`}>
      <p className="t-label text-[3.4cqw]">{item.tag}</p>
      {item.tamil && (
        <span
          lang="ta"
          aria-hidden
          className="absolute right-[7cqw] top-[16cqw] font-tamil text-[15cqw] font-bold leading-none opacity-20"
        >
          {item.tamil}
        </span>
      )}
      <p
        className={`relative font-display font-extrabold leading-[0.98] tracking-[-0.035em] ${long ? "text-[13cqw]" : "text-[17cqw]"}`}
      >
        {item.title}
      </p>
    </div>
  );
}
