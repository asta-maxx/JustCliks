import type { Tone } from "@/lib/content";

export const toneClass: Record<Tone, string> = {
  accent: "bg-orange text-on-orange",
  ink: "bg-fg text-bg",
  paper: "bg-surface-2 text-fg",
};

type Props = { title: string; tone: Tone; tag?: string; tamil?: string };

const titleSize = (t: string) => (t.length <= 4 ? "text-[30cqw]" : t.length <= 14 ? "text-[14cqw]" : "text-[11.5cqw]");

// A type-only cover for a project. Used until real footage is added.
export function Poster({ title, tone, tag, tamil }: Props) {
  return (
    <div className={`@container relative h-full w-full overflow-hidden ${toneClass[tone]}`}>
      <div className="flex h-full flex-col justify-between p-[7cqw]">
        {tag ? <p className="t-label text-[3.2cqw] opacity-80">{tag}</p> : <span />}
        {tamil && (
          <span
            lang="ta"
            aria-hidden
            className={`pointer-events-none absolute right-[7cqw] top-[12cqw] font-tamil font-bold leading-none opacity-20 ${tamil.length > 5 ? "text-[14cqw]" : "text-[20cqw]"}`}
          >
            {tamil}
          </span>
        )}
        <p className={`relative font-display font-extrabold leading-[0.98] tracking-[-0.035em] ${titleSize(title)}`}>{title}</p>
      </div>
    </div>
  );
}
