import { type Metadata } from "next";
import PlaceImportClient from "./PlaceImportClient";

export const metadata: Metadata = {
  title: "Import Places | Admin",
  description: "Import places from Google Maps",
};

export default function PlacesImportPage() {
  return <PlaceImportClient />;
}
