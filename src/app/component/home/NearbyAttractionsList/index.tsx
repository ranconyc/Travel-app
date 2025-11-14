import { Activity } from "@/domain/activity/activity.schema";
import ActivityCard from "../../common/cards/ActivityCard";
import { sectionTitle } from "../HomeLoggedIn";
import { FakeMates } from "../NearbyMateList";

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
