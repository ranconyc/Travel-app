type DistanceUnit = "KM" | "MI" | "meters";

/**
 * Haversine distance between two coordinates.
 * Always returns a number (no NaN surprises).
 */
export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: DistanceUnit = "KM"
): number {
  // Normalize: ensure numbers, avoid accidental NaN
  lat1 = Number(lat1);
  lon1 = Number(lon1);
  lat2 = Number(lat2);
  lon2 = Number(lon2);

  const toRad = (v: number) => (v * Math.PI) / 180;

  // Δlat, Δlon in radians
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  // Convert to radians only once
  const rLat1 = toRad(lat1);
  const rLat2 = toRad(lat2);

  // Haversine core formula
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Earth's radius in KM
  const KM = 6371;
  const km = KM * c;

  switch (unit) {
    case "meters":
      return km * 1000;
    case "MI":
      return km * 0.621371;
    default:
      return km;
  }
}

export function isPointInBoundingBox(
  lat: number,
  lng: number,
  bounding: [string, string, string, string]
) {
  const south = parseFloat(bounding[0]); // minLat
  const north = parseFloat(bounding[1]); // maxLat
  const west = parseFloat(bounding[2]); // minLng
  const east = parseFloat(bounding[3]); // maxLng

  return lat >= south && lat <= north && lng >= west && lng <= east;
}
