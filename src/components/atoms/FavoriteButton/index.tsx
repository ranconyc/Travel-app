"use client";

import { Heart } from "lucide-react";
import { FavoriteType } from "@prisma/client";
import { useFavoriteToggle } from "@/domain/favorite/favorite.hooks";
import Button from "@/components/atoms/Button";
import { cva } from "class-variance-authority";

const iconVariants = cva("transition-colors", {
  variants: {
    active: { true: "fill-error text-error", false: "text-txt-main" },
  },
  defaultVariants: { active: false },
});

interface FavoriteButtonProps {
  type: FavoriteType;
  entityId: string;
  initialIsFavorited?: boolean;
  className?: string;
}

export default function FavoriteButton({
  type,
  entityId,
  initialIsFavorited = false,
  className = "",
}: FavoriteButtonProps) {
  const { isFavorited, toggle, isPending } = useFavoriteToggle(
    type,
    entityId,
    initialIsFavorited,
  );

  return (
    <Button
      variant="icon"
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      disabled={isPending}
      className={className}
      icon={
        <Heart size={20} className={iconVariants({ active: isFavorited })} />
      }
    />
  );
}
