const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCityCountryRelationships() {
  try {
    console.log('🔍 Checking city-country relationships...\n');
    
    // Get all cities with their country info
    const cities = await prisma.city.findMany({
      include: {
        country: true
      },
      take: 20 // Limit to first 20 for now
    });

    console.log(`Found ${cities.length} cities:\n`);

    let issues = [];
    let validCities = [];

    cities.forEach((city, index) => {
      const hasCountry = city.country && city.country.name;
      const hasCountryRef = city.countryRefId;
      
      console.log(`${index + 1}. ${city.name}`);
      console.log(`   City ID: ${city.cityId}`);
      console.log(`   Country: ${hasCountry ? city.country.name : 'NULL'}`);
      console.log(`   Country Ref ID: ${hasCountryRef || 'NULL'}`);
      console.log(`   Has Image: ${city.imageHeroUrl ? 'YES' : 'NO'}`);
      
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
          countryName: city.country.name,
          hasImage: !!city.imageHeroUrl
        });
      }
      
      console.log('');
    });

    console.log('\n📊 SUMMARY:');
    console.log(`Total cities checked: ${cities.length}`);
    console.log(`Cities with valid country: ${validCities.length}`);
    console.log(`Cities with issues: ${issues.length}`);

    if (issues.length > 0) {
      console.log('\n❌ ISSUES FOUND:');
      issues.forEach(issue => {
        console.log(`- ${issue.cityName} (${issue.cityId}): ${issue.issue}`);
      });
    }

    if (validCities.length > 0) {
      console.log('\n✅ VALID CITIES:');
      validCities.forEach(city => {
        console.log(`- ${city.cityName}, ${city.countryName} ${city.hasImage ? '🖼️' : '📷'}`);
      });
    }

  } catch (error) {
    console.error('Error checking city-country relationships:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCityCountryRelationships();
