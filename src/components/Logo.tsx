import Image from "next/image";
import logo from "../../public/brand/justcliks-logo.png";
import logoLight from "../../public/brand/justcliks-logo-light.png";

type Props = {
  height?: number;
  // "light" is for dark backgrounds: the ink turns to paper, the orange stays.
  variant?: "ink" | "light";
  priority?: boolean;
  className?: string;
};

export function Logo({ height = 44, variant = "ink", priority = false, className = "" }: Props) {
  const src = variant === "light" ? logoLight : logo;
  return (
    <Image
      src={src}
      alt="JustCliks"
      height={height}
      width={Math.round((height * src.width) / src.height)}
      priority={priority}
      className={`block select-none ${className}`}
      style={{ height, width: "auto" }}
    />
  );
}
