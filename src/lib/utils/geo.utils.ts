/**
 * Estimates the radius of a city based on its bounding box
 */
export function estimateRadiusKmFromBBox(
  bbox?: [number, number, number, number],
): number {
  if (!bbox) return 30;
  const [south, north, west, east] = bbox;
  const latDiff = Math.abs(north - south);
  const lonDiff = Math.abs(east - west);
  const approxDeg = Math.max(latDiff, lonDiff);
  return Math.round((approxDeg * 111) / 2);
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @param unit "KM" for kilometers, "M" for meters, "MI" for miles
 * @returns Distance in the specified unit
 */
export function calculateHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  unit: "KM" | "M" | "MI" = "KM",
): number {
  const R = 6371; // Earth's radius in km
  const toRad = Math.PI / 180;

  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lng2 - lng1) * toRad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * toRad) *
      Math.cos(lat2 * toRad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  switch (unit) {
    case "M":
      return distanceKm * 1000;
    case "MI":
      return distanceKm * 0.621371;
    default:
      return distanceKm;
  }
}
