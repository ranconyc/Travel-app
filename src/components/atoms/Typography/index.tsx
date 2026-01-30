import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("transition-colors", {
  variants: {
    variant: {
      // Headlines (Sora)
      h1: "text-display-lg font-bold font-sora tracking-tight",
      h2: "text-display-md font-bold font-sora tracking-tight",
      h3: "text-display-sm font-semibold font-sora tracking-tight",
      h4: "text-display-sm font-semibold font-sora",

      // Display (Sora) - For Hero sections
      "display-xl": "text-display-xl font-black font-sora tracking-tighter",
      "display-lg": "text-display-lg font-bold font-sora tracking-tight",
      "display-md": "text-display-md font-bold font-sora tracking-tight",
      "display-sm": "text-display-sm font-semibold font-sora tracking-tight",

      // Body (Inter)
      p: "text-p font-sans",
      "body-lg": "text-lg font-sans leading-relaxed",
      body: "text-p font-sans",
      "body-sm": "text-sm font-sans leading-relaxed",

      // UI (Inter) - Functional text
      "ui-lg": "text-lg font-medium font-sans",
      ui: "text-base font-medium font-sans",
      "ui-sm": "text-sm font-medium font-sans",

      // Labels & Captions
      label: "text-label font-semibold uppercase tracking-wider",
      "label-sm": "text-label-sm font-semibold uppercase tracking-wider",
      caption: "text-caption font-normal font-sans",
      "caption-sm": "text-xs font-normal font-sans text-txt-sec",
      tiny: "text-caption font-sans uppercase font-medium",
      micro: "text-micro font-sans uppercase font-bold tracking-wider",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      black: "font-black",
    },
    color: {
      main: "text-txt-main",
      sec: "text-txt-sec",
      brand: "text-brand",
      error: "text-error",
      inverse: "text-white dark:text-txt-main",
      success: "text-success",
      warning: "text-warning",
      white: "text-white",
      muted: "text-secondary/60",
    },
    wrap: {
      balance: "text-balance", // Best for headings (2-3 lines)
      pretty: "text-pretty", // Best for paragraphs (avoids orphans)
      nowrap: "whitespace-nowrap",
      normal: "whitespace-normal",
    },
  },
  defaultVariants: {
    variant: "p",
    color: "sec",
    wrap: "pretty",
  },
});

type TypographyVariantProps = VariantProps<typeof typographyVariants>;

interface TypographyProps
  extends
    Omit<TypographyVariantProps, "color">,
    React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  isLoading?: boolean;
  color?:
    | "main"
    | "sec"
    | "brand"
    | "error"
    | "inverse"
    | "success"
    | "warning"
    | "white"
    | "muted";
}

export default function Typography({
  variant = "p",
  weight,
  wrap,
  isLoading,
  children,
  className = "",
  as,
  color = "sec",
  ...props
}: TypographyProps) {
  const tagMap: Record<
    NonNullable<TypographyVariantProps["variant"]>,
    React.ElementType
  > = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    "display-xl": "h1",
    "display-lg": "h1",
    "display-md": "h2",
    "display-sm": "h3",
    p: "p",
    "body-lg": "p",
    body: "p",
    "body-sm": "p",
    "ui-lg": "span",
    ui: "span",
    "ui-sm": "span",
    label: "span",
    "label-sm": "span",
    caption: "p",
    "caption-sm": "p",
    tiny: "span",
    micro: "span",
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "animate-pulse bg-surface-secondary rounded-md h-[1.2em] w-full max-w-[200px]",
          className,
        )}
        aria-hidden="true"
        {...props}
      />
    );
  }

  const Component = as || tagMap[variant || "p"];

  // Default wrapping for headings should be balance, otherwise pretty
  const resolvedWrap =
    wrap ||
    (["h1", "h2", "h3", "h4"].includes(variant || "") ? "balance" : "pretty");

  // Determine default color based on variant if not explicitly provided
  const resolvedColor =
    ["h1", "h2", "h3", "h4"].includes(variant || "") && color === "sec"
      ? "main"
      : color;

  return (
    <Component
      className={cn(
        typographyVariants({
          variant,
          color: resolvedColor,
          weight,
          wrap: resolvedWrap,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
