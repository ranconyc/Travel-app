export type DistanceUnit = "KM" | "MI" | "meters";

/**
 * Haversine distance between two coordinates.
 * Always returns a number (no NaN surprises).
 */
export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: DistanceUnit = "KM",
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
  bounding: [string, string, string, string],
) {
  const south = parseFloat(bounding[0]); // minLat
  const north = parseFloat(bounding[1]); // maxLat
  const west = parseFloat(bounding[2]); // minLng
  const east = parseFloat(bounding[3]); // maxLng

  return lat >= south && lat <= north && lng >= west && lng <= east;
}

/* ------------------------------------------------------------------ */
/* Distance + flight-time helpers for UI                              */
/* ------------------------------------------------------------------ */

/** Internal: normalize any distance + unit to KM */
export function distanceToKm(distance: number, unit: DistanceUnit): number {
  if (!Number.isFinite(distance)) return 0;

  switch (unit) {
    case "KM":
      return distance;
    case "MI":
      return distance * 1.60934;
    case "meters":
      return distance / 1000;
  }
}

/**
 * Format a distance for display.
 * - Small distances: show exact meters / km / miles
 * - Medium distances: compact (e.g. "1,200k km away")
 * - Very large distances: use qualitative label (e.g. "Very far away")
 */

export function formatDistanceLabel(
  distance: number,
  unit: DistanceUnit = "KM",
): string {
  if (!Number.isFinite(distance)) return "";

  const km = distanceToKm(distance, unit);
  if (km <= 0) return "";

  // 1) Very short distances → meters (no ~)
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} m away`;
  }

  // 2) Nearby (walk / short drive) → exact km
  if (km < 50) {
    const rounded = Math.round(km);
    return `${rounded} km away`;
  }

  // 3) Medium distances → round to nearest 10 km, add ~
  if (km < 2000) {
    const roundedKm = Math.round(km / 10) * 10; // nearest 10 km
    const prettyKm = roundedKm.toLocaleString();

    if (unit === "MI") {
      const miles = Math.round((roundedKm * 0.621371) / 10) * 10; // nearest 10 mi
      const prettyMi = miles.toLocaleString();
      return `~${prettyMi} mi away`;
    }

    return `~${prettyKm} km away`;
  }

  // 4) Far distances → round to nearest 100 km, add ~ (your “~2,900 km away” case)
  const roundedFarKm = Math.round(km / 100) * 100; // nearest 100 km
  const prettyFarKm = roundedFarKm.toLocaleString();

  if (unit === "MI") {
    const miles = Math.round((roundedFarKm * 0.621371) / 100) * 100; // nearest 100 mi
    const prettyMi = miles.toLocaleString();
    return `~${prettyMi} mi away`;
  }

  return `~${prettyFarKm} km away`;
}

/**
 * Estimate flight time in hours based on great-circle distance.
 * Rough model:
 * - Cruise speed ~850 km/h
 * - +1.5h ground/connection buffer
 */
export function estimateFlightTimeHoursFromDistance(
  distance: number,
  unit: DistanceUnit = "KM",
): number {
  const km = distanceToKm(distance, unit);
  if (km <= 0) return 0;

  const cruiseSpeedKmH = 850;
  const bufferHours = 1.5;

  const hours = km / cruiseSpeedKmH + bufferHours;

  // Round to nearest 0.5 hour so labels look nice
  return Math.round(hours * 2) / 2;
}

/**
 * Format a human-friendly flight time label.
 * Examples:
 * - "~1h flight"
 * - "2–4h flight"
 * - "~11h flight"
 */
export function formatFlightTimeLabelFromDistance(
  distance: number,
  unit: DistanceUnit = "KM",
): string {
  const hours = estimateFlightTimeHoursFromDistance(distance, unit);
  if (hours === 0) return "";

  if (hours < 1.5) return "~1h flight";
  if (hours < 2.5) return "~2h flight";
  if (hours < 4) return "2–4h flight";
  if (hours < 7) return "4–7h flight";
  if (hours < 11) return "7–11h flight";

  return `~${Math.round(hours)}h flight`;
}

/**
 * Optional: combined label for very large distances.
 * For example, for 12735 km you can show:
 * "Very far (~15h flight)"
 */
export function formatDistanceWithFlightHint(
  distance: number,
  unit: DistanceUnit = "KM",
): string {
  const km = distanceToKm(distance, unit);

  // Reuse distance label for the "normal" cases
  const base = formatDistanceLabel(distance, unit);

  // Add flight hint only for *really* large distances
  if (km < 3000) return base;

  const flight = formatFlightTimeLabelFromDistance(distance, unit);
  return flight ? `${base} (${flight})` : base;
}

/**
 * Calculate radius from bounding box.
 * Returns null if bounding box is invalid.
 */
export function radiusFromBoundingBox(bounding: string[] | number[]) {
  if (!bounding || bounding.length < 4) return null;

  const south = parseFloat(String(bounding[0]));
  const north = parseFloat(String(bounding[1]));
  const west = parseFloat(String(bounding[2]));
  const east = parseFloat(String(bounding[3]));

  const centerLat = (south + north) / 2;
  const centerLng = (west + east) / 2;

  // distance from center → north edge = radius
  const radiusKm = getDistance(centerLat, centerLng, north, centerLng, "KM");

  return radiusKm;
}

/**
 * Calculate bounding box from center point and radius.
 * Returns null if radius is invalid.
 */
export default function calculateBoundingBox(
  lat: number,
  lng: number,
  radiusKm: number,
) {
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)));

  return {
    sw: [lng - lngDelta, lat - latDelta],
    ne: [lng + lngDelta, lat + latDelta],
  };
}
