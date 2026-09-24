"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CheckCircle, Info, Warning, XCircle, CircleNotch } from "@phosphor-icons/react";

// shadcn Sonner on the site theme: dark, sharp, marigold edge for status.
const Toaster = (props: ToasterProps) => (
  <Sonner
    theme="dark"
    position="bottom-center"
    icons={{
      success: <CheckCircle size={18} weight="bold" />,
      info: <Info size={18} weight="bold" />,
      warning: <Warning size={18} weight="bold" />,
      error: <XCircle size={18} weight="bold" />,
      loading: <CircleNotch size={18} weight="bold" className="animate-spin" />,
    }}
    toastOptions={{
      classNames: {
        toast: "!rounded-none !border-[1.5px] !border-accent !bg-paper-2 !text-ink !font-sans !shadow-none",
        description: "!text-muted",
      },
    }}
    {...props}
  />
);

export { Toaster };
