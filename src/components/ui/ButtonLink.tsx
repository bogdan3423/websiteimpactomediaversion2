import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";

type Variant = "solid" | "outline" | "solid-inverse" | "outline-inverse";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-signal",
  outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
  "solid-inverse": "bg-paper text-ink hover:bg-signal hover:text-paper",
  "outline-inverse": "border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink",
};

type Props = Omit<ComponentProps<typeof Link>, "className"> & {
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
};

/** Rectangular call-to-action. Sharp corners, short colour transition, nudging arrow. */
export function ButtonLink({ children, variant = "solid", external, className = "", ...props }: Props) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  const classes = `group inline-flex min-h-12 items-center justify-between gap-6 px-5 py-3 text-[0.9375rem] font-medium leading-none transition-colors duration-200 ${variants[variant]} ${className}`;
  return (
    <Link
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <span>{children}</span>
      <Icon className={`arrow-nudge shrink-0 text-base ${external ? "" : "arrow-nudge-right"}`} />
    </Link>
  );
}

/** Inline text link with an animated hairline underline and arrow. */
export function TextLink({
  children,
  external,
  className = "",
  ...props
}: Omit<ComponentProps<typeof Link>, "className"> & { children: ReactNode; external?: boolean; className?: string }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <Link
      className={`group inline-flex items-center gap-2 font-medium ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <span className="link-line">{children}</span>
      <Icon className={`arrow-nudge shrink-0 ${external ? "" : "arrow-nudge-right"}`} />
    </Link>
  );
}
