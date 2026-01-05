"use client";

import { City } from "@/domain/city/city.schema";
import { addTrip } from "@/domain/trip/trip.actions";
import { User } from "@/domain/user/user.schema";
import { CalendarPlus } from "lucide-react";

type Props = {
  user: User;
  city: City;
};

export default function AddTrip({ user, city }: Props) {
  const handleAddTrip = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Adding trip...", user.id, city.cityId);
    addTrip(user.id, city.cityId);
  };
  return <CalendarPlus size={22} onClick={handleAddTrip} />;
}
