import "server-only";

const METEOSTAT_BASE_URL = "https://meteostat.p.rapidapi.com/point/normals";

export type ClimateNormalMonth = {
  month: number; // 1-12
  tavg: number | null; // °C
  tmin: number | null;
  tmax: number | null;
  prcp: number | null; // mm
  wspd: number | null;
  pres: number | null;
  tsun: number | null; // sunshine minutes
};

export async function fetchClimateNormals(
  lat: number,
  lon: number
): Promise<ClimateNormalMonth[]> {
  const apiKey = process.env.METEOSTAT_API_KEY;
  if (!apiKey) {
    throw new Error("Missing METEOSTAT_API_KEY env var");
  }

  const url = new URL(METEOSTAT_BASE_URL);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("units", "metric"); // °C, mm

  const res = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "meteostat.p.rapidapi.com",
    },
    cache: "force-cache",
    // normals are long-term averages → safe to cache for a month
    next: { revalidate: 60 * 60 * 24 * 30 },
  });

  if (!res.ok) {
    throw new Error(`Meteostat normals error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return (json.data ?? []) as ClimateNormalMonth[];
}
