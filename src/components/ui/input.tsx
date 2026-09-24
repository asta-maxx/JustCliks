import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

// shadcn Input, restyled: sharp, 1.5px rule, no glow ring, no transitions.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 border-[1.5px] border-ink/30 bg-paper px-3 text-base text-ink outline-none placeholder:text-muted hover:border-ink/60 focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-accent",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
