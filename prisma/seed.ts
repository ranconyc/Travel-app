// prisma/seed.ts
import { prisma } from "@/lib/db/prisma";

async function main() {
  const thailand = await prisma.country.upsert({
    where: { countryId: "thailand" },
    update: {
      name: "Thailand",
      code: "TH",
      currency: { code: "THB", name: "Thai Baht", symbol: "฿" },
      emergency: {
        emergency: "191",
        ambulance: "1669",
        fire: "199",
        touristPolice: "1155",
      } as any,
      visaEntry: {
        visaOnArrivalNote:
          "Many nationalities receive 30–60 days visa-free/VOA; verify.",
        passportValidityNote: "6+ months validity recommended.",
      } as any,
      languageComm: {
        usefulPhrases: [
          { en: "Hello", local: "Sawasdee (ka/krap)" },
          { en: "Thank you", local: "Khob khun (ka/krap)" },
        ],
        englishProficiencyNote:
          "Moderate in tourist areas; translation apps help elsewhere.",
      } as any,
      utilities: {
        electricity: { voltage: 230, frequencyHz: 50, plugs: ["A", "B", "C"] },
      } as any,
      internet: {
        simNote: "AIS, TrueMove, dtac widely available",
        wifiNote: "Hotels/cafés/malls Wi-Fi",
      } as any,
      gettingAround: {
        tips: "Domestic flights + trains; ride-hailing in big cities",
      } as any,

      imageHeroUrl: "https://cdn.yoursite.com/countries/thailand/hero.jpg",
      images: [
        "https://cdn.yoursite.com/countries/thailand/hero.jpg",
        "https://cdn.yoursite.com/countries/thailand/alt-1.jpg",
      ],
      bestSeason: "Nov–Apr",
      idealDuration: "10–14 days (classic route)",
      safety: "Generally safe; usual travel precautions.",
      regions: ["North", "Central", "Isan", "South (Andaman)", "South (Gulf)"],
    },
    create: {
      countryId: "thailand",
      name: "Thailand",
      code: "TH",
      currency: { code: "THB", name: "Thai Baht", symbol: "฿" },
      emergency: {
        emergency: "191",
        ambulance: "1669",
        fire: "199",
        touristPolice: "1155",
      } as any,
      visaEntry: {
        visaOnArrivalNote:
          "Many nationalities receive 30–60 days visa-free/VOA; verify.",
        passportValidityNote: "6+ months validity recommended.",
      } as any,
      languageComm: {
        usefulPhrases: [
          { en: "Hello", local: "Sawasdee (ka/krap)" },
          { en: "Thank you", local: "Khob khun (ka/krap)" },
        ],
        englishProficiencyNote:
          "Moderate in tourist areas; translation apps help elsewhere.",
      } as any,
      utilities: {
        electricity: { voltage: 230, frequencyHz: 50, plugs: ["A", "B", "C"] },
      } as any,
      internet: {
        simNote: "AIS, TrueMove, dtac widely available",
        wifiNote: "Hotels/cafés/malls Wi-Fi",
      } as any,
      gettingAround: {
        tips: "Domestic flights + trains; ride-hailing in big cities",
      } as any,

      imageHeroUrl: "https://cdn.yoursite.com/countries/thailand/hero.jpg",
      images: [
        "https://cdn.yoursite.com/countries/thailand/hero.jpg",
        "https://cdn.yoursite.com/countries/thailand/alt-1.jpg",
      ],
      bestSeason: "Nov–Apr",
      idealDuration: "10–14 days (classic route)",
      safety: "Generally safe; usual travel precautions.",
      regions: ["North", "Central", "Isan", "South (Andaman)", "South (Gulf)"],
    },
  });

  await prisma.city.upsert({
    where: { cityId: "bangkok-th" },
    update: {
      name: "Bangkok",
      imageHeroUrl: "https://cdn.yoursite.com/cities/bangkok/hero.jpg",
      images: [
        "https://cdn.yoursite.com/cities/bangkok/hero.jpg",
        "https://cdn.yoursite.com/cities/bangkok/thumb.jpg",
      ],
      bestSeason: "Nov–Apr",
      idealDuration: "3–5 days",
      safety: "Urban pickpocket risk in crowded areas.",
      // either keep the split fields OR use `budget` JSON. If you keep JSON:
      budget: {
        budget: { min: 1200, max: 1800 },
        midRange: { min: 2500, max: 4300 },
        luxury: { min: 6000, max: null },
      } as any,
      gettingAround: [
        {
          name: "BTS/MRT",
          note: "Fast, air-conditioned",
          badge: { text: "฿15–60", tone: "green" },
        },
        { name: "Grab/Bolt", note: "Ride-hailing" },
        {
          name: "Tuk-tuk",
          note: "Negotiate fare",
          badge: { text: "Negotiate", tone: "orange" },
        },
        {
          name: "Chao Phraya Boat",
          note: "Scenic river",
          badge: { text: "฿10–40", tone: "green" },
        },
      ] as any,
    },
    create: {
      cityId: "bangkok-th",
      name: "Bangkok",
      countryRefId: thailand.id,
      imageHeroUrl: "https://cdn.yoursite.com/cities/bangkok/hero.jpg",
      images: [
        "https://cdn.yoursite.com/cities/bangkok/hero.jpg",
        "https://cdn.yoursite.com/cities/bangkok/thumb.jpg",
      ],
      bestSeason: "Nov–Apr",
      idealDuration: "3–5 days",
      safety: "Urban pickpocket risk in crowded areas.",
      budget: {
        budget: { min: 1200, max: 1800 },
        midRange: { min: 2500, max: 4300 },
        luxury: { min: 6000, max: null },
      } as any,
      gettingAround: [
        {
          name: "BTS/MRT",
          note: "Fast, air-conditioned",
          badge: { text: "฿15–60", tone: "green" },
        },
        { name: "Grab/Bolt", note: "Ride-hailing" },
        {
          name: "Tuk-tuk",
          note: "Negotiate fare",
          badge: { text: "Negotiate", tone: "orange" },
        },
        {
          name: "Chao Phraya Boat",
          note: "Scenic river",
          badge: { text: "฿10–40", tone: "green" },
        },
      ] as any,
    },
  });
}

main()
  .then((x) => console.log("✅ Seed complete: Thailand + Bangkok", x))
  .catch((err) => console.error(err));
