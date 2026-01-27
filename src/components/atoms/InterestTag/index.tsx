import { cn } from "@/lib/utils";

interface InterestTagProps {
  children: React.ReactNode;
  className?: string;
}

export default function InterestTag({ children, className }: InterestTagProps) {
  return (
    <div
      className={cn(
        "px-4 py-2 bg-surface text-app-fg text-ui-sm rounded-2xl border border-surface transition-colors hover:border-brand/30",
        className,
      )}
    >
      {children}
    </div>
  );
}
