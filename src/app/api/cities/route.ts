import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import readline from "readline";

export async function GET(req: NextRequest) {
  const filePath = path.join(process.cwd(), "src/data/", "cities15000.txt");

  // יצירת ממשק קריאה שורה-שורה
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const cities = [];
  let count = 0;

  try {
    for await (const line of rl) {
      const cols = line.split("\t");

      // const cityData = {
      //   cityId:
      //     cols[2].toLowerCase().replace(/\s+/g, "-") +
      //     "-" +
      //     cols[8].toLowerCase(), // Slug from asciiname
      //   name: cols[1],
      //   // IMPORTANT: MongoDB 2dsphere index requires [lng, lat] order
      //   coords: {
      //     type: "Point",
      //     coordinates: [parseFloat(cols[5]), parseFloat(cols[4])],
      //   },
      //   population: parseInt(cols[14]) || 0,
      //   timeZone: cols[17],
      //   state: cols[10], // Admin1 code (e.g., "CA" for California)
      //   district: cols[11], // Admin2 code (e.g., "037" for LA County)
      //   isCapital: cols[7] === "PPLC", // PPLC is the GeoNames code for a country capital

      //   // This requires a pre-existing Country in your DB with this ISO code
      //   // You would usually do a lookup: const country = await db.country.findUnique({ where: { code: cols[8] } })
      //   countryCode: cols[8],
      // };

      const cityData = {
        geonameId: cols[0],
        name: cols[1],
        asciiName: cols[2],
        alternateNames: cols[3].split(","),
        coords: {
          type: "Point",
          coordinates: [parseFloat(cols[5]), parseFloat(cols[4])],
        },
        featureClass: cols[6],
        featureCode: cols[7],
        country: cols[8],
        cc2: cols[9],
        admin1: cols[10],
        admin2: cols[11],
        population: cols[12],
        elevation: cols[13],
        dem: cols[14],
        timezone: cols[15],
        modificationDate: cols[16],
        updateDate: cols[18],
        isCapital: cols[7] === "PPLC", // PPLC is the GeoNames code for a country capital
      };
      // לצורך הדוגמה, נעצור אחרי 500 כדי לא לתקוע את הדפדפן
      count++;
      if (count >= 500) break;

      cities.push(cityData);
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${count} cities`,
      data: cities,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
