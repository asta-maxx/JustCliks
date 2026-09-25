import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "JustCliks: we make the posts people stop scrolling for.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The link preview on WhatsApp, Instagram, LinkedIn and friends.
export default async function OpenGraphImage() {
  const [cabinet, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/fonts/og/cabinet-800.woff")),
    readFile(join(process.cwd(), "public/brand/justcliks-logo.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f3ee",
          padding: "64px 72px",
          fontFamily: "Cabinet",
          color: "#1c1c1b",
        }}
      >
        <img src={logoSrc} alt="" width={176} height={132} style={{ objectFit: "contain" }} />
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 82, lineHeight: 1.02, letterSpacing: "-0.035em", maxWidth: 980 }}>
          <span>We make the posts people&nbsp;</span>
          <span style={{ background: "#f68c25", padding: "0 10px" }}>stop</span>
          <span>&nbsp;scrolling for.</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Cabinet", data: cabinet, weight: 800, style: "normal" }] },
  );
}
