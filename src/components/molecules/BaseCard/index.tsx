import React from "react";
import Card from "@/components/molecules/Card";

type BaseCardProps = {
  children: React.ReactNode;
  image?: {
    src?: string;
    alt: string;
    priority?: boolean;
  };
  linkHref?: string;
  className?: string;
  aspectRatio?: string;
  gradient?: boolean | string;
  priority?: boolean;
};

/**
 * @deprecated Use Card component instead.
 * Example: <Card variant="image" image={...} />
 */
export default function BaseCard({
  children,
  image,
  linkHref,
  className = "",
  aspectRatio = "aspect-[3.2/4]",
  gradient = true,
  priority = false,
}: BaseCardProps) {
  return (
    <Card
      variant="image"
      image={image}
      linkHref={linkHref}
      className={className}
      aspectRatio={aspectRatio as any}
      gradient={gradient}
      priority={priority}
    >
      {children}
    </Card>
  );
}
