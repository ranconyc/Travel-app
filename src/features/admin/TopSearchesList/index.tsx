import Link from "next/link";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import { Search, TrendingUp } from "lucide-react";
import { Timeframe } from "@/domain/admin/admin.types";

interface TopSearchItem {
  query: string;
  count: number;
}

interface TopSearchesListProps {
  searches: TopSearchItem[];
  currentTimeframe: Timeframe;
}

export default function TopSearchesList({
  searches,
  currentTimeframe,
}: TopSearchesListProps) {
  const timeframes: { label: string; value: Timeframe }[] = [
    { label: "Today", value: "today" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "All", value: "all" },
  ];

  return (
    <Block>
      <div className="flex flex-col gap-md mb-md">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={20} />
          <Typography variant="h1" className="font-bold w-fit capitalize">
            Top Searches
          </Typography>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-fit">
          {timeframes.map((tf) => (
            <Link
              key={tf.value}
              href={`?timeframe=${tf.value}`}
              className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                currentTimeframe === tf.value
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm font-medium"
                  : "text-secondary dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              {tf.label}
            </Link>
          ))}
        </div>
      </div>

      {searches.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-secondary">
          <Search className="w-12 h-12 mb-2 text-gray-300" />
          <p>No search data for this period.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {searches.map((item, index) => (
            <div key={item.query} className="relative">
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-medium flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <span className="w-5 text-gray-400 text-xs text-right">
                    #{index + 1}
                  </span>
                  {item.query}
                </span>
                <span className="text-secondary text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  {item.count} searches
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 dark:bg-gray-700">
                <div
                  className="bg-blue-500 h-1.5 rounded-full opacity-60"
                  style={{
                    width: `${
                      (item.count / Math.max(...searches.map((s) => s.count))) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Block>
  );
}
