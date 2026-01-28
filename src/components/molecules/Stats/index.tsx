import { StatItem } from "@/domain/common.schema";

interface StatsProps {
  stats: StatItem[];
  className?: string;
  showDividers?: boolean;
}

export default function Stats({
  stats,
  className = "",
  showDividers = true,
}: StatsProps) {
  return (
    <div
      className={`flex items-center justify-between px-6 py-4 bg-surface rounded-2xl shadow-card border border-surface-secondary/50 backdrop-blur-sm ${className}`}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isMiddle = showDividers && index > 0 && index < stats.length - 1;

        return (
          <div
            key={`${stat.label}-${index}`}
            className={`text-center flex-1 animate-scale-in`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl md:text-3xl font-bold font-sora text-txt-main leading-tight">
                {stat.value}
              </span>

              <span className="text-xs text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                {Icon && <Icon size={12} className="text-brand" />}
                {stat.label}
              </span>
            </div>
            {isMiddle && (
              <div className="absolute left-0 top-1/2 h-8 w-px bg-surface-secondary/50 -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
        );
      })}
    </div>
  );
}
