import Link from "next/link";
import Block from "@/app/components/common/Block";
import Title from "@/app/components/Title";
import { CheckCircle, AlertCircle } from "lucide-react";
import { formatDate } from "@/app/_utils/date";

interface ReviewItem {
  id: string;
  name: string;
  type: "country" | "city" | "activity";
  slug?: string; // for links
  entityId?: string; // alternate for links
  subtitle?: string;
  autoCreated: boolean;
  createdAt?: Date;
}

interface ReviewItemsListProps {
  title: string;
  items: ReviewItem[];
}

export default function ReviewItemsList({
  title,
  items,
}: ReviewItemsListProps) {
  if (items.length === 0) {
    return (
      <Block>
        <Title>{title}</Title>
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <CheckCircle className="w-12 h-12 mb-2 text-green-500" />
          <p>All caught up! No items to review.</p>
        </div>
      </Block>
    );
  }

  return (
    <Block>
      <div className="flex items-center justify-between mb-4">
        <Title>{title}</Title>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
          {items.length} pending
        </span>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => (
          <div key={item.id} className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900/30">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.subtitle} {item.autoCreated && "• Auto-created"}
                  {item.createdAt && ` • ${formatDate(item.createdAt)}`}
                </p>
              </div>
            </div>

            <Link
              href={getLink(item)}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Review
            </Link>
          </div>
        ))}
      </div>
    </Block>
  );
}

function getLink(item: ReviewItem): string {
  switch (item.type) {
    case "country":
      return `/country/${item.entityId}`;
    case "city":
      return `/city/${item.entityId}`;
    case "activity":
      return `/activity/${item.slug}`;
    default:
      return "#";
  }
}
