import { Activity } from "@/domain/activity/activity.schema";
import ActivityCard from "../../common/cards/ActivityCard";
import { sectionTitle } from "../HomeLoggedIn";

type Props = {
  activities?: Activity[];
};

const bangkokActivities = [
  {
    id: "yaowarat-chinatown",
    name: "Chinatown Night Market (Yaowarat)",
    image:
      "https://images.unsplash.com/photo-1672934324111-b1a3df1c6fe4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8WWFvd2FyYXQlMjBSb2FkfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
  },
  {
    id: "health-land-massage",
    name: "Health Land Spa",
    image:
      "https://plus.unsplash.com/premium_photo-1661682870922-2f011fca6ad5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dGhhaSUyMG1hc3NhZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900",
  },
  {
    id: "tichuca-rooftop",
    name: "Tichuca Rooftop",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRG1EXDWs4IaY7o2LGZjx6fxV3huJyhQeUrg&s",
  },
  {
    id: "chatuchak-market",
    name: "Chatuchak Weekend Market",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2039",
  },
  {
    id: "longtail-boat",
    name: "Chao Phraya Boat Ride ",
    image: "",
  },
];

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

export default function NearbyAttractionsList({ activities }: Props) {
  return (
    <>
      <h1 className={sectionTitle}>Nearby Attractions</h1>
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory">
        {bangkokActivities.map((activity, index) => (
          <div className="snap-start" key={activity.id}>
            <ActivityCard
              activity={{ ...activity, mates: FakeMates }}
              index={index}
            />
          </div>
        ))}
      </div>
    </>
  );
}
