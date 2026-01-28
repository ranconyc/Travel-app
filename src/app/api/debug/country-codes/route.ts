import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) console.log('🔍 Checking country codes in database...');

    // Get sample countries to see the format
    const sampleCountries = await prisma.country.findMany({
      take: 10,
      select: {
        cca3: true,
        code: true,
        name: true
      }
    });

    // Get sample cities to see what they have
    const sampleCities = await prisma.city.findMany({
      take: 10,
      select: {
        name: true,
        countryRefId: true,
        country: {
          select: {
            cca3: true,
            code: true,
            name: true
          }
        }
      }
    });

    // Find cities with no countryRefId
    const citiesWithNoRef = await prisma.city.findMany({
      where: {
        countryRefId: null
      },
      take: 10,
      select: {
        name: true,
        countryRefId: true
      }
    });

    // Test country matching
    const testCodes = ['US', 'USA', 'GB', 'GBR', 'FR', 'FRA'];
    const testResults: any[] = [];
    
    for (const testCode of testCodes) {
      const byCode = await prisma.country.findFirst({
        where: { code: testCode },
        select: { name: true, code: true, cca3: true }
      });
      
      const byCca3 = await prisma.country.findFirst({
        where: { cca3: testCode },
        select: { name: true, code: true, cca3: true }
      });

      testResults.push({
        testCode,
        byCode: byCode || null,
        byCca3: byCca3 || null
      });
    }

    return NextResponse.json({
      success: true,
      sampleCountries,
      sampleCities,
      citiesWithNoRef: {
        count: citiesWithNoRef.length,
        cities: citiesWithNoRef
      },
      testResults
    });

  } catch (error) {
    console.error('Error checking country codes:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
