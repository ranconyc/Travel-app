import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("transition-colors", {
  variants: {
    variant: {
      // Headlines (Sora) - Mapped to Display tokens per design
      h1: "type-display-lg font-bold font-sora",
      h2: "type-display-md font-bold font-sora",
      h3: "type-display-sm font-semibold font-sora",
      h4: "type-display-sm font-semibold font-sora",

      // Display (Sora) - Headless utilities
      "display-xl": "type-display-xl",
      "display-lg": "type-display-lg",
      "display-md": "type-display-md",
      "display-sm": "type-display-sm",

      // Body (Inter)
      p: "text-base font-inter leading-relaxed",
      "body-lg": "text-lg font-inter leading-relaxed",
      body: "text-base font-inter leading-relaxed",
      "body-sm": "text-sm font-inter leading-relaxed",

      // UI (Inter) - Functional text
      "ui-lg": "text-lg font-medium font-inter",
      ui: "text-base font-medium font-inter",
      "ui-sm": "text-sm font-medium font-inter",

      // Labels & Captions
      label: "text-sm font-semibold font-inter uppercase tracking-wider",
      "label-sm": "text-xs font-semibold font-inter uppercase tracking-wider",
      caption: "text-sm font-normal font-inter",
      "caption-sm": "text-xs font-normal font-inter text-txt-muted",
      tiny: "text-tiny font-inter uppercase font-medium",
      micro: "text-micro font-inter uppercase font-bold tracking-wider",
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
      muted: "text-txt-muted",
      brand: "text-brand",
      error: "text-error",
      inverse: "text-white dark:text-txt-main",
      success: "text-success",
      warning: "text-warning",
      white: "text-white",
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
