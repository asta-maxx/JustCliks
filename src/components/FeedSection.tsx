import { Viewfinder } from "./Viewfinder";
import { RevealHeading } from "./RevealHeading";

export function FeedSection() {
  return (
    <section aria-labelledby="feed-title" className="bg-paper-2">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-4 py-32 md:px-8 lg:grid-cols-12 lg:gap-8 md:py-48">
        <div className="lg:col-span-5">
          <RevealHeading id="feed-title" className="type-mass text-[12vw] md:text-[5rem] lg:text-[4.6rem]">
            Blink and they scrolled.
          </RevealHeading>
          <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-muted md:text-xl">
            Our feed is rolling. Press Clik and catch a frame. Your customers decide just as fast, so every post has
            to earn the stop.
          </p>
        </div>
        <div className="flex justify-center lg:col-span-6 lg:col-start-7 lg:justify-end">
          <Viewfinder />
        </div>
      </div>
    </section>
  );
}
