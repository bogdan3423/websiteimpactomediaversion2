import Image from "next/image";
import logoOnDark from "@/assets/brand/logo-on-dark.png";
import logoOnLight from "@/assets/brand/logo-on-light.png";

/** The original ImpactoMedia wordmark, with an inverted version for dark surfaces. */
export function Logo({ tone = "light", className = "", preload = false }: { tone?: "light" | "dark"; className?: string; preload?: boolean }) {
  return (
    <Image
      src={tone === "dark" ? logoOnDark : logoOnLight}
      alt="ImpactoMedia"
      sizes="(min-width: 768px) 190px, 150px"
      className={`h-auto w-[150px] md:w-[178px] ${className}`}
      preload={preload}
      quality={85}
    />
  );
}
