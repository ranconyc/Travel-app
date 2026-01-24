import { LucideIcon } from "lucide-react";
import Block from "@/components/atoms/Block";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-blue-500",
}: StatCardProps) {
  return (
    <Block>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary dark:text-gray-400">
            {label}
          </p>
          <p className="text-2xl font-bold dark:text-white">{value}</p>
        </div>
        <div
          className={`p-3 rounded-full bg-opacity-10 dark:bg-opacity-20 ${color.replace(
            "text-",
            "bg-"
          )}`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </Block>
  );
}
