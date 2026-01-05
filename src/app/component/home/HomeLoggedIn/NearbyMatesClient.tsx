import Header from "@/app/mates/_components/Header";
import MateCard from "../../common/cards/MateCard";

export default function NearbyMatesClient({ mates }: { mates: any[] }) {
  console.log(mates);
  return (
    <div>
      <Header />
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mates.map((mate) => (
            <MateCard
              key={mate.id}
              mate={mate}
              loggedUser={mates[0]}
              priority={false}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
