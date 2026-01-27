import { NextResponse } from 'next/server';
import { getCityImage, getPlaceImage } from '@/utils/image-helpers';

export async function GET() {
  try {
    // Test helper functions
    const cityImage = await getCityImage('San Francisco', 'USA');
    const placeImage = await getPlaceImage('Golden Gate Bridge');

    // Check environment variables
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    const pexelsKey = process.env.PEXELS_API_KEY;

    return NextResponse.json({
      success: true,
      tests: {
        cityImage: cityImage ? '✅ Success' : '❌ Failed',
        placeImage: placeImage ? '✅ Success' : '❌ Failed',
        unsplashKey: unsplashKey ? '✅ Set' : '❌ Missing',
        pexelsKey: pexelsKey ? '✅ Set' : '❌ Missing',
      },
      results: {
        cityImageUrl: cityImage,
        placeImageUrl: placeImage,
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
