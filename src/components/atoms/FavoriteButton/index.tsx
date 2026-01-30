"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { FavoriteType } from "@prisma/client";
import { toggleFavoriteAction } from "@/domain/favorite/favorite.actions";
import Button from "@/components/atoms/Button";

interface FavoriteButtonProps {
  type: FavoriteType;
  entityId: string;
  initialIsFavorited?: boolean;
  className?: string;
}

import { cva } from "class-variance-authority";

const favoriteIconVariants = cva("transition-colors", {
  variants: {
    active: {
      true: "fill-error text-error",
      false: "text-txt-main",
    },
  },
  defaultVariants: {
    active: false,
  },
});

export default function FavoriteButton({
  type,
  entityId,
  initialIsFavorited = false,
  className = "",
}: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticIsFavorited, setOptimisticIsFavorited] = useOptimistic(
    initialIsFavorited,
    (_, newState: boolean) => newState,
  );

  const handleToggle = () => {
    startTransition(async () => {
      // Optimistically toggle
      setOptimisticIsFavorited(!optimisticIsFavorited);

      const result = await toggleFavoriteAction({ type, entityId });

      // If the action failed, the optimistic state will be corrected on next render
      if (!result.success) {
        console.error("Failed to toggle favorite:", result.error);
      }
    });
  };

  return (
    <Button
      variant="icon"
      aria-label={
        optimisticIsFavorited ? "Remove from favorites" : "Add to favorites"
      }
      onClick={handleToggle}
      disabled={isPending}
      className={className}
      icon={
        <Heart
          size={20}
          className={favoriteIconVariants({ active: optimisticIsFavorited })}
        />
      }
    />
  );
}
