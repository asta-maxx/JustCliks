import type { FeedItem } from "@/lib/content";

const tone = {
  accent: "bg-orange text-on-orange",
  ink: "bg-fg text-bg",
  paper: "bg-surface-2 text-fg",
} as const;

// The outer box is the size container; padding and type inside scale with it.
export function PostFrame({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`@container h-full w-full ${className}`}>
      <div className="relative flex h-full flex-col justify-between overflow-hidden p-[8cqw]">{children}</div>
    </div>
  );
}

// One post in a feed. Generic posts are flat and grey; client posts are bold.
export function FeedCard({ item }: { item: FeedItem }) {
  if (item.kind === "noise") {
    return (
      <PostFrame className="bg-surface text-dim">
        <p className="t-label text-[3.6cqw]">{item.tag}</p>
        <p className="font-display text-[11cqw] font-extrabold leading-[1.02] tracking-[-0.03em]">{item.title}</p>
      </PostFrame>
    );
  }
  const long = item.title.length > 14;
  return (
    <PostFrame className={tone[item.tone]}>
      <p className="t-label text-[3.6cqw]">{item.tag}</p>
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
    </PostFrame>
  );
}
