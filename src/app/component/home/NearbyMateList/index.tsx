import { User } from "@/domain/user/formUser.schema";
import { sectionTitle } from "../HomeLoggedIn";
import MateCard from "../../common/cards/MateCard";
import { isResSent } from "next/dist/shared/lib/utils";

export const FakeMates = [
  {
    id: 1,
    name: "Steven Lang",
    age: 32,
    location: "Bangkok, TH",
    interests: ["Foodie", "Early riser", "Spontaneous"],
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1480",
  },
  {
    id: 2,
    name: "Chinaza Akachi",
    age: 23,
    location: "Bangkok, TH",
    interests: ["Foodie", "Early riser", "Spontaneous"],
    image:
      "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1985",
  },
  {
    id: 3,
    name: "Joan O'Keefe",
    age: 27,
    location: "Bangkok, TH",
    interests: ["Spontaneous", "Foodie", "Early riser"],
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1064",
  },
  {
    id: 4,
    name: "Sonia Schultz",
    age: 29,
    location: "Bangkok, TH",
    interests: ["Adventurous", "Culture lover"],
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1061",
  },
];

type Props = { mates: any };
export default function NearbyMateList({ mates }: Props) {
  return (
    <>
      <h1 className={sectionTitle}>Nearby Travelers</h1>
      {/* TODO: calculate the distance */}
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory">
        {mates.map((mate: User, index: number) => (
          <div className="snap-start" key={mate.name}>
            <MateCard
              mate={{ ...mate, isResSent: index > 0 ? false : true }}
              priority={index > 3}
            />
          </div>
        ))}
      </div>
    </>
  );
}
