import Card from "@/components/molecules/Card";
import { Avatar } from "@/components/atoms/Avatar";
import { AvatarList, type AvatarUser } from "@/components/molecules/AvatarList";

type ActivityCardProps = {
  activity: {
    id: string;
    name: string;
    image: string;
    mates: AvatarUser[];
    slug?: string;
  };
  index: number;
};

export default function ActivityCard({ activity, index }: ActivityCardProps) {
  const { id, name, image, mates, slug } = activity;

  return (
    <Card
      variant="image"
      image={{
        src: image,
        alt: name || "Activity image",
        priority: index < 3,
      }}
      linkHref={`/place/${slug || id}`}
      priority={index < 3}
      gradient="bg-gradient-to-t from-black/60 via-black/30 to-transparent"
    >
      <div className="h-full flex items-end p-4">
        <div>
          <AvatarList list={mates} maxVisible={3} showExtra />
          <h3 className="text-white min-h-[45px] font-bold leading-tight text-[clamp(18px,2.8vw,24px)] line-clamp-2 mt-2">
            {name}
          </h3>
        </div>
      </div>
    </Card>
  );
}
