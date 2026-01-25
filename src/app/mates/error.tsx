"use client";

import { useEffect } from "react";
import EmptyState from "@/components/atoms/EmptyState";
import Button from "@/components/atoms/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <EmptyState
        title="Something went wrong"
        description="We couldn't load the mates. Please try again."
        icon={<span className="text-4xl">⚠️</span>}
      />
      <Button
        variant="primary"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="mt-4"
      >
        Try again
      </Button>
    </div>
  );
}
