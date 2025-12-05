import Header from "@/app/nearby-mates/_components/Header";
import MateCard from "../../common/cards/MateCard";

export default function NearbyMatesClient({ mates }: { mates: any[] }) {
  console.log(mates);
  return (
    <div>
      <Header />
      <div className="grid grid-cols-2 gap-4">
        {mates.map((mate) => (
          <MateCard
            key={mate.id}
            mate={mate}
            loggedUser={mates[0]}
            priority={false}
          />
        ))}
      </div>
    </div>
  );
}
