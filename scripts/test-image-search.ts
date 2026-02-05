// scripts/test-image-search.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createApi } from "unsplash-js";
import fetch from "node-fetch";

if (!globalThis.fetch) {
  // @ts-ignore
  globalThis.fetch = fetch;
}

async function testUnsplash() {
  console.log("Testing Unsplash Search...");
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashAccessKey) {
    console.error("Missing UNSPLASH_ACCESS_KEY");
    return;
  }

  const unsplash = createApi({
    accessKey: unsplashAccessKey,
    fetch: fetch as any,
  });

  try {
    const result = await unsplash.search.getPhotos({
      query: "paris",
      page: 1,
      perPage: 3,
    });

    if (result.errors) {
      console.error("Unsplash errors:", result.errors);
    } else {
      console.log(
        `Found ${result.response.results.length} images from Unsplash.`,
      );
      result.response.results.forEach((img) => {
        console.log(`- ${img.id}: ${img.user.name} (${img.urls.small})`);
      });
    }
  } catch (e) {
    console.error("Unsplash exception:", e);
  }
}

async function main() {
  await testUnsplash();
}

main();
