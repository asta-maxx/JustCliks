import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full resize-y border-[1.5px] border-ink/30 bg-paper px-3 py-3 text-base text-ink outline-none [field-sizing:content] placeholder:text-muted hover:border-ink/60 focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
