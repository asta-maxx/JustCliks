import type { Tone } from "@/lib/content";

export const toneClass: Record<Tone, string> = {
  accent: "bg-accent text-on-accent",
  ink: "bg-ink text-paper",
  paper: "bg-paper-3 text-ink",
};

type Props = {
  title: string;
  tone: Tone;
  tag?: string;
  tamil?: string;
};

// Short names get huge, long ones wrap tighter. Sized to the poster, not the page.
const titleSize = (t: string) => (t.length <= 4 ? "text-[34cqw]" : t.length <= 12 ? "text-[17cqw]" : "text-[13cqw]");

// A type-only cover for a project. Used until real footage is added.
export function Poster({ title, tone, tag, tamil }: Props) {
  return (
    <div className={`@container relative h-full w-full overflow-hidden ${toneClass[tone]}`}>
      <div className="flex h-full flex-col justify-between p-[7cqw]">
        {tag ? <p className="type-label opacity-80">{tag}</p> : <span />}
        {tamil && (
          <span
            lang="ta"
            aria-hidden
            className={`pointer-events-none absolute right-[6cqw] top-[10cqw] font-tamil font-bold leading-none opacity-20 ${tamil.length > 5 ? "text-[15cqw]" : "text-[24cqw]"}`}
          >
            {tamil}
          </span>
        )}
        <p className={`type-mass relative [overflow-wrap:anywhere] ${titleSize(title)}`}>{title}</p>
      </div>
    </div>
  );
}
