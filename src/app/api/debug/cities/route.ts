import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) console.log('🔍 Checking city-country relationships...');
    
    // Get all cities with their country info
    const cities = await prisma.city.findMany({
      include: {
        country: true
      },
      take: 20 // Limit to first 20 for now
    });

    if (isDev) console.log(`Found ${cities.length} cities`);

    let issues: any[] = [];
    let validCities: any[] = [];

    cities.forEach((city) => {
      const hasCountry = city.country && city.country.name;
      const hasCountryRef = city.countryRefId;
      
      if (!hasCountry) {
        issues.push({
          cityName: city.name,
          cityId: city.cityId,
          countryRefId: city.countryRefId,
          issue: !hasCountryRef ? 'No country reference' : 'Country reference exists but no relationship'
        });
      } else {
        validCities.push({
          cityName: city.name,
          countryName: city.country!.name,
          hasImage: !!city.imageHeroUrl
        });
      }
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalCities: cities.length,
        validCities: validCities.length,
        issues: issues.length
      },
      validCities,
      issues,
      allCities: cities.map(city => ({
        name: city.name,
        cityId: city.cityId,
        country: city.country?.name || 'NULL',
        countryRefId: city.countryRefId || 'NULL',
        hasImage: !!city.imageHeroUrl
      }))
    });

  } catch (error) {
    console.error('Error checking city-country relationships:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
