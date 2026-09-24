"use client";

import Image from "next/image";
import { useState } from "react";
import type { Media } from "@/lib/content";

// Real footage with a skeleton that holds the shape until the first frame arrives.
export function MediaSlot({ media, alt }: { media: Media; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-full w-full bg-paper-2" aria-busy={!loaded && !failed}>
      {!loaded && !failed && <div aria-hidden className="skeleton absolute inset-0" />}
      {failed && (
        <p className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-muted">
          This clip could not load.
        </p>
      )}
      {media.kind === "video" ? (
        <video
          className="h-full w-full object-cover"
          src={media.src}
          poster={media.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-label={alt}
          onLoadedData={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : (
        <Image
          src={media.src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 40vw, 80vw"
          className="object-cover"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
