"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

// Section headings rise out of a line mask as they enter, so the eye lands on
// the headline before the body copy.
export function RevealHeading({ children, className = "", id }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current!, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.08,
              scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
            });
          },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <h2 ref={ref} id={id} className={className}>
      {children}
    </h2>
  );
}
