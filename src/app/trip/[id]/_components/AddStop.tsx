"use client";

import Button from "@/app/component/common/Button";
import { User } from "@/domain/user/user.schema";
import { Trip } from "@/domain/user/user.schema";
import { Plus } from "lucide-react";

type Props = { loggedUser: User; trip: Trip };

export default function AddStop({ loggedUser, trip }: Props) {
  const handleAddStop = () => {
    console.log("adding stop....", loggedUser?.id, trip?.id);
    //name of the user that adding the stop.
    // the PlacId of the city.
    // the tripId
    // the arrivalDate
    // the departureDate
    // the notes
    // take the trip and add a new stop to it.
  };
  return (
    <Button
      variant="outline"
      className="!py-1 !px-3 !text-xs"
      onClick={handleAddStop}
    >
      <Plus className="w-4 h-4 mr-1" /> Add Stop
    </Button>
  );
}
