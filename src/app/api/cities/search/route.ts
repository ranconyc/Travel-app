import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const MAX_RESULTS = 10;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  // 1) Try local DB first
  const localCities = await prisma.city.findMany({
    where: {
      name: { contains: q, mode: "insensitive" },
    },
    include: {
      country: { select: { id: true, name: true, code: true } },
    },
    take: MAX_RESULTS,
  });

  console.log(`GET /api/cities/search?q=${q}`, localCities);

  if (localCities.length > 0) {
    // normalize local cities to the autocomplete shape
    const normalized = localCities.map((c) => ({
      id: c.id, // real City.id from DB
      cityId: c.cityId,
      label: c.country ? `${c.name}, ${c.country.name}` : c.name,
      subtitle: c.country?.code ?? null,
      lat: (c.coords as any)?.coordinates?.[1],
      lng: (c.coords as any)?.coordinates?.[0],
      autoCreated: c.autoCreated,
      needsReview: c.needsReview,
      source: "db" as const,
      // no meta needed, it's already a real City
    }));

    return NextResponse.json(normalized);
  }

  // 2) Fallback to external API (LocationIQ) – NO DB writes here
  console.log(`GET /api/cities/search?q=${q} searching from external API...`);

  const apiKey = process.env.LOCATIONIQ_API_KEY;
  if (!apiKey) {
    console.error("Missing LOCATIONIQ_API_KEY env variable");
    return NextResponse.json([]);
  }

  const url = new URL("https://api.locationiq.com/v1/autocomplete");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", q);
  url.searchParams.set("limit", String(MAX_RESULTS));
  url.searchParams.set("normalizeaddress", "1");
  url.searchParams.set("dedupe", "1");
  url.searchParams.set("accept-language", "en"); // force English results

  const externalRes = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!externalRes.ok) {
    console.error("LocationIQ request failed", externalRes.status);
    return NextResponse.json([]);
  }

  const externalData = (await externalRes.json()) as any[];
  console.log("raw response from LocationIQ API", externalRes);
  console.log(
    "raw data from LocationIQ API",
    externalData.filter(
      (item) => item.class === "place" || item.type === "city"
    )
  );

  // 3) Map LocationIQ results into lightweight city candidates for the UI
  const cityCandidates = externalData
    .filter((item) => item.class === "place" || item.type === "city")
    .map((item) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);

      const cityName =
        item.address?.city ||
        item.address?.town ||
        item.address?.village ||
        item.display_place ||
        item.name;

      const countryName =
        item.address?.country ||
        item.display_address?.split(",").slice(-1)[0]?.trim() ||
        "";

      const countryCode = (item.address?.country_code || "").toUpperCase();

      return {
        tempId: item.place_id?.toString() ?? `${cityName}-${countryCode}`,
        cityId: `${cityName
          ?.toLowerCase()
          .trim()
          .replace(/\s+/g, "-")}-${countryCode.toLowerCase()}`,
        name: cityName,
        countryName,
        countryCode,
        boundingbox: item.boundingbox,
        lat,
        lng,
      };
    })
    .filter(
      (c) =>
        c.name && c.countryName && !Number.isNaN(c.lat) && !Number.isNaN(c.lng)
    );

  if (cityCandidates.length === 0) {
    return NextResponse.json([]);
  }

  // console.log(
  //   `GET /api/cities/search?q=${q} found ${cityCandidates.length} candidates`,
  //   cityCandidates
  // );

  // 4) Return normalized shape for Autocomplete (external source)
  const normalizedExternal = cityCandidates.map((c) => ({
    id: c.tempId, // for React key, not DB id
    cityId: c.cityId,
    label: `${c.name}, ${c.countryName}`,
    subtitle: c.countryCode,
    lat: c.lat,
    lng: c.lng,
    boundingbox: c.boundingbox,
    source: "external" as const,
    // meta payload used later when user selects this city
    meta: {
      name: c.name,
      countryName: c.countryName,
      countryCode: c.countryCode,
      lat: c.lat,
      lng: c.lng,
    },
  }));

  return NextResponse.json(normalizedExternal);
}
