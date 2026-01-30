import Card from "@/components/molecules/Card";
import { AvatarList, type AvatarUser } from "@/components/molecules/AvatarList";
import Typography from "@/components/atoms/Typography";
import { cn } from "@/lib/utils";

type ActivityCardProps = {
  activity: {
    id: string;
    name: string;
    image: string;
    mates: AvatarUser[];
    slug?: string;
  };
  index: number;
  className?: string; // Support custom className
};

export default function ActivityCard({
  activity,
  index,
  className,
}: ActivityCardProps) {
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
      className={cn("h-full", className)}
    >
      <div className="h-full flex items-end p-4">
        <div>
          <AvatarList list={mates} maxVisible={3} showExtra />
          <Typography
            variant="h3"
            weight="bold"
            color="inverse"
            className="min-h-[45px] leading-tight text-[clamp(18px,2.8vw,24px)] line-clamp-2 mt-2"
          >
            {name}
          </Typography>
        </div>
      </div>
    </Card>
  );
}
