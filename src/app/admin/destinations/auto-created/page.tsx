import { getAllPlacesAction } from "@/domain/place/place.actions";
import { updatePlaceAction } from "@/domain/place/place.actions";
import AutoCreatedPlacesClient from "./AutoCreatedPlacesClient";

export const dynamic = "force-dynamic";

export default async function AutoCreatedPlacesPage() {
  // Fetch only autoCreated places
  const allPlacesRes = await getAllPlacesAction({});
  const allPlaces = allPlacesRes.success ? (allPlacesRes.data ?? []) : [];
  
  // Filter for autoCreated places
  const autoCreatedPlaces = allPlaces.filter(place => place.autoCreated === true);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 font-sora">
          Auto-Created Places Verification
        </h1>
        <p className="text-secondary">
          Review and verify places automatically imported from Google Places. 
          These places were created during the Bangkok sync process and need admin approval.
        </p>
      </div>
      
      <AutoCreatedPlacesClient places={autoCreatedPlaces} />
    </div>
  );
}
