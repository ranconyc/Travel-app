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
      className={`flex items-center justify-between px-2 py-4 bg-surface/50 rounded-2xl backdrop-blur-sm border border-surface-secondary ${className}`}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isMiddle = showDividers && index > 0 && index < stats.length - 1;

        return (
          <div
            key={`${stat.label}-${index}`}
            className={`text-center flex-1 ${
              isMiddle ? "border-l border-r border-surface-secondary" : ""
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-bold font-sora capitalize truncate w-full px-1">
                {stat.value}
              </span>
              <span className="text-xs text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
                {Icon && <Icon size={stat.iconSize || 10} />}
                {stat.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
