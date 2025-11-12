import { getAge } from "@/app/_utils/age";
import { User } from "@/domain/user/user.schema";
import Image from "next/image";
import Link from "next/link";

const MateTypeBadge = ({ isLocal }: { isLocal: boolean }) => (
  <div
    className={`${
      isLocal ? "bg-blue-500" : "bg-yellow-500"
    } text-white px-2 py-1 rounded-full text-xs capitalize w-fit`}
  >
    {isLocal ? "local" : "visitor"}
  </div>
);

const StatusIndicator = ({ isOnline }: { isOnline: boolean }) => (
  <div
    className={`${
      isOnline ? "bg-green-500" : "bg-red-500"
    } h-2 w-2 rounded-full`}
  ></div>
);

export default function MateCard({ mate }: { mate: User }) {
  console.log("mate", mate);
  return (
    <Link href={`/profile/${mate.id}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden min-w-[240px] h-[300px] mx-auto shadow">
        <div className="relative h-full">
          <Image
            src={
              mate.image ||
              "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=2039"
            }
            alt={mate.name}
            fill
            sizes="(max-width: 768px) 80vw, 240px"
            className="object-cover"
          />

          {/* henglish: gradient overlay for readable text */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/55" />

          {/* henglish: content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center gap-2">
              <StatusIndicator isOnline={mate.isOnline} />
              <div className="text-white text-sm">
                {mate.location.split(",")[0]}
              </div>
              <MateTypeBadge isLocal={mate.isLocal} />
            </div>
            <h3 className="text-white font-bold leading-tight text-[clamp(14px,2.8vw,18px)] line-clamp-2 mt-2">
              {mate.name}, {getAge(mate.dob)}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}
