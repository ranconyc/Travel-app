import Image from "next/image";
import Link from "next/link";

export function Avatar({ image, name, size, className, ...props }) {
  const cssSize =
    size === "sm"
      ? "w-8 h-8"
      : size === "lg"
      ? "w-14 h-14"
      : size === "xl"
      ? "w-16 h-16"
      : "w-10 h-10";

  const aSize =
    size === "sm" ? 32 : size === "lg" ? 56 : size === "xl" ? 64 : 40;

  return (
    <div
      className={`${cssSize}  ${className} bg-white relative inline-block rounded-full overflow-hidden `}
      {...props}
    >
      <Image
        className="object-cover"
        src={
          image ||
          "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
        }
        alt={`${name} profile`}
        sizes="(max-width: 768px) 100vw, 100px"
        fill
      />
    </div>
  );
}

export function AvatarList({ list, numOfMates = 3 }) {
  const otherMates = list.length - numOfMates;
  return (
    <div className="flex gap-2 w-fit bg-white/40 rounded-full p-2 pb-0.5">
      <div className="flex -space-x-4">
        {list?.map((user, i) =>
          i < numOfMates ? (
            <div key={user?.id} className="">
              <Avatar size="sm" image={user.image} name={user.name} />
            </div>
          ) : null
        )}
      </div>

      {otherMates === 0 ? null : (
        <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex justify-center items-center text-xl">
          +{otherMates}
        </span>
      )}
    </div>
  );
}

export default function ActivityCard({
  activity,
}: {
  activity: { id: string; name: string; image: string; mates: any[] };
}) {
  const { id, name, image, mates } = activity;

  return (
    <Link href={`/activity/${id}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden min-w-[240px] h-[300px] mx-auto shadow">
        <div className="relative h-full">
          <Image
            src={
              image ||
              "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=2039"
            }
            alt={name}
            fill
            sizes="(max-width: 768px) 80vw, 240px"
            className="object-cover"
          />

          {/* henglish: gradient overlay for readable text */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/55" />

          {/* henglish: content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <AvatarList list={mates} />{" "}
            {/* henglish: shared travelers preview */}
            <h3 className="text-white font-bold leading-tight text-[clamp(14px,2.8vw,18px)] line-clamp-2 mt-2">
              {name}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}
