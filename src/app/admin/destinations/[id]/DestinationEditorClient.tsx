"use client";

import CountryEditor from "@/components/organisms/editors/CountryEditor";
import CityEditor from "@/components/organisms/editors/CityEditor";
import PlaceEditor from "@/components/organisms/editors/PlaceEditor";
import StateEditor from "@/components/organisms/editors/StateEditor";

type Props = {
  id: string;
  type: "country" | "city" | "place" | "state";
  initialData: any;
};

export default function DestinationEditorClient({
  id,
  type,
  initialData,
}: Props) {
  if (type === "country") {
    return <CountryEditor id={id} initialData={initialData} />;
  }

  if (type === "city") {
    return <CityEditor id={id} initialData={initialData} />;
  }

  if (type === "place") {
    return <PlaceEditor id={id} initialData={initialData} />;
  }

  if (type === "state") {
    return <StateEditor id={id} initialData={initialData} />;
  }

  return <div>Unknown destination type: {type}</div>;
}
