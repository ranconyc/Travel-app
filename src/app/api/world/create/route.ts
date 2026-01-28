import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs/promises";
import * as path from "path";

export async function GET(req: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV !== "production";
    const world = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,region,subregion,continents",
    ).then((res) => res.json());
    const filePath = path.join(process.cwd(), "src/data", "world.json");

    //   console.log("create world", world);

    if (isDev) console.log("create world", filePath);

    const x = await fs.writeFile(filePath, JSON.stringify(world, null, 2));
    if (isDev) console.log("create writeFile", x);

    return NextResponse.json({
      status: "success",
      message: "World created",
      world,
    });
  } catch (error) {
    return NextResponse.json({ status: "error", error });
  }
}
