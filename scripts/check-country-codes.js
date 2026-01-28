const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCountryCodes() {
  try {
    console.log('🔍 Checking country codes in database...\n');

    // Get sample countries to see the format
    console.log('📊 Sample Countries:');
    const sampleCountries = await prisma.country.findMany({
      take: 10,
      select: {
        cca3: true,
        code: true,
        name: true
      }
    });

    sampleCountries.forEach(country => {
      console.log(`${country.name}: cca3="${country.cca3}", code="${country.code}"`);
    });

    console.log('\n🏙️  Sample Cities:');
    // Get sample cities to see what countryCode they have
    const sampleCities = await prisma.city.findMany({
      take: 10,
      select: {
        name: true,
        countryCode: true,
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

    sampleCities.forEach(city => {
      console.log(`${city.name}: countryCode="${city.countryCode}", countryRefId="${city.countryRefId || 'NULL'}"`);
      if (city.country) {
        console.log(`  → Linked to: ${city.country.name} (cca3="${city.country.cca3}", code="${city.country.code}")`);
      } else {
        console.log(`  → No country relationship`);
      }
    });

    console.log('\n🔍 Finding cities with countryCode but no countryRefId:');
    const citiesWithCodeButNoRef = await prisma.city.findMany({
      where: {
        countryCode: { not: null },
        countryRefId: null
      },
      take: 10,
      select: {
        name: true,
        countryCode: true,
        countryRefId: true
      }
    });

    console.log(`Found ${citiesWithCodeButNoRef.length} cities with countryCode but no countryRefId:`);
    citiesWithCodeButNoRef.forEach(city => {
      console.log(`- ${city.name}: countryCode="${city.countryCode}"`);
    });

    console.log('\n🎯 Testing country matching:');
    // Test if we can find countries by cca3 vs code
    const testCodes = ['US', 'USA', 'GB', 'GBR', 'FR', 'FRA'];
    
    for (const testCode of testCodes) {
      const byCode = await prisma.country.findFirst({
        where: { code: testCode },
        select: { name: true, code: true, cca3: true }
      });
      
      const byCca3 = await prisma.country.findFirst({
        where: { cca3: testCode },
        select: { name: true, code: true, cca3: true }
      });

      console.log(`"${testCode}":`);
      if (byCode) console.log(`  → By code: ${byCode.name} (${byCode.code}/${byCode.cca3})`);
      if (byCca3) console.log(`  → By cca3: ${byCca3.name} (${byCca3.code}/${byCca3.cca3})`);
      if (!byCode && !byCca3) console.log(`  → Not found`);
    }

  } catch (error) {
    console.error('Error checking country codes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCountryCodes();
