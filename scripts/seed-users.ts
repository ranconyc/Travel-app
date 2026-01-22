import { PrismaClient, Gender } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting user seeding...");

  // 1. Load data files
  const dataDir = path.join(process.cwd(), "src/data");
  const dailyRhythms = JSON.parse(
    fs.readFileSync(path.join(dataDir, "dailyRhythms.json"), "utf8"),
  );
  const travelStyles = JSON.parse(
    fs.readFileSync(path.join(dataDir, "travelStyles.json"), "utf8"),
  );
  const interestsData = JSON.parse(
    fs.readFileSync(path.join(dataDir, "interests.json"), "utf8"),
  );
  const languages = JSON.parse(
    fs.readFileSync(path.join(dataDir, "languages.json"), "utf8"),
  );

  // Extract interest IDs
  const allInterestIds: string[] = [];
  Object.values(interestsData).forEach((cat: any) => {
    cat.items.forEach((item: any) => allInterestIds.push(item.id));
  });

  // 2. Fetch required entities from DB
  const cities = await prisma.city.findMany({
    select: { id: true, countryRefId: true },
  });
  const countries = await prisma.country.findMany({ select: { cca3: true } });

  if (cities.length === 0) {
    console.error("No cities found in DB. Please seed cities first.");
    return;
  }

  const firstNames = [
    "James",
    "Emma",
    "Liam",
    "Olivia",
    "Noah",
    "Ava",
    "Lucas",
    "Isabella",
    "Ethan",
    "Sophia",
    "Mason",
    "Mia",
    "Logan",
    "Charlotte",
    "Caleb",
    "Amelia",
    "Jack",
    "Harper",
    "Aiden",
    "Evelyn",
    "Mateo",
    "Abigail",
    "Sebastian",
    "Emily",
    "Kai",
    "Luna",
    "Zane",
    "Aria",
    "Leo",
    "Maya",
    "Felix",
    "Nora",
    "Jasper",
    "Zara",
    "Hugo",
    "Elena",
    "Milo",
    "Sasha",
    "Arlo",
    "Clara",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
  ];

  const genders: Gender[] = [Gender.MALE, Gender.FEMALE, Gender.NON_BINARY];

  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${Math.floor(Math.random() * 1000)}@example.com`;
    const gender = genders[Math.floor(Math.random() * genders.length)];

    // Random city & country
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const visitedCount = Math.floor(Math.random() * 5) + 2;
    const visitedCountries = countries
      .sort(() => 0.5 - Math.random())
      .slice(0, visitedCount)
      .map((c) => c.cca3);

    const userId = uuidv4();
    const avatarUrl = `https://i.pravatar.cc/300?u=${userId}`;

    // Persona
    const rhythm =
      dailyRhythms[Math.floor(Math.random() * dailyRhythms.length)].label;
    const style =
      travelStyles[Math.floor(Math.random() * travelStyles.length)].label;
    const userInterests = allInterestIds
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 3);

    // Languages
    const userLanguages = languages
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 1)
      .map((l: any) => l.name);

    // 3. Create User
    const user = await prisma.user.create({
      data: {
        email,
        name,
        avatarUrl,
        passwordHash:
          "$2b$10$wT/fAInEit7YhN7vL5.kOO9rRE9b.YQG.kX.Y5gTz3S4Z2Hn6P9Ky", // "password"
        profileCompleted: true,
        currentCityId: randomCity.id,
        visitedCountries,
        profile: {
          create: {
            firstName,
            lastName,
            gender,
            birthday: new Date(
              1980 + Math.floor(Math.random() * 25),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28),
            ),
            homeBaseCityId: randomCity.id,
            languages: userLanguages,
            persona: {
              dailyRhythm: rhythm,
              travelStyle: style,
              interests: userInterests,
            },
            socials: {
              instagram: `@${firstName.toLowerCase()}_travels`,
              tiktok: `@${firstName.toLowerCase()}_explores`,
            },
            description: `I love exploring new places and meeting new people. Currently focusing on ${style.toLowerCase()} travel.`,
          },
        },
      },
    });

    console.log(`Created user ${i + 1}/50: ${name}`);
  }

  console.log("User seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
