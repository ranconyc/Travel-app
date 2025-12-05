import BaseCard from "../BaseCard";
import { AvatarList } from "../../AvatarList";
import { Activity } from "@/domain/activity/activity.schema";


type ActivityCardProps = {
  activity: { id: string | number; name: string; image: string; mates: any[]; }
  // activity: Pick<Activity, "id" | "name" | "images"| 'mates' >;
  index: number;
};

export default function ActivityCard({
  activity,

  index,
}: ActivityCardProps) {
  const { id, name, image, mates  } = activity;

  return (
    <BaseCard
      image={{ src: image, alt: name || "Activity image" }}
      linkHref={`/activity/${id}`}
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
