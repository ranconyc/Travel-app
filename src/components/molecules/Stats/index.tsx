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
      className={`flex items-center justify-between px-sm py-md bg-bg-card rounded-card shadow-soft border border-stroke ${className}`}
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
            <div className="flex flex-col items-center">
              <span className="text-h3 font-bold font-sora capitalize truncate w-full text-txt-main">
                {stat.value}
              </span>

              <span className="text-tiny text-txt-sec font-bold uppercase tracking-wider flex items-center gap-xs">
                {/* {Icon && <Icon size={stat.iconSize || 12} />} */}
                {stat.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
