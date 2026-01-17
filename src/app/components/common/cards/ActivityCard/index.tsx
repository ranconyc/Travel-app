import BaseCard from "@/app/components/common/cards/BaseCard";
import { AvatarList } from "@/app/components/common/AvatarList";
type ActivityCardProps = {
  activity: {
    id: string;
    name: string;
    image: string;
    mates: any[];
    slug?: string;
  };
  index: number;
};

export default function ActivityCard({
  activity,

  index,
}: ActivityCardProps) {
  const { id, name, image, mates, slug } = activity;

  return (
    <BaseCard
      image={{ src: image, alt: name || "Activity image" }}
      linkHref={`/place/${slug || id}`}
      priority={index < 3}
    >
      <div className="h-full flex items-end">
        <div>
          <AvatarList list={mates} maxVisible={3} showExtra />
          <h3 className="text-white min-h-[45px] font-bold leading-tight text-[clamp(18px,2.8vw,24px)] line-clamp-2 mt-2">
            {name}
          </h3>
        </div>
      </div>
    </BaseCard>
  );
}
