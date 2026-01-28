const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixCityCountryRelationships() {
  try {
    console.log('🔧 Fixing city-country relationships...\n');

    // Step 1: Find all cities without proper country relationships
    console.log('📊 Step 1: Finding cities without country relationships...');
    
    const citiesWithoutCountry = await prisma.city.findMany({
      where: {
        OR: [
          { countryRefId: null },
          { country: null }
        ]
      },
      include: {
        country: true
      }
    });

    console.log(`Found ${citiesWithoutCountry.length} cities with issues\n`);

    if (citiesWithoutCountry.length === 0) {
      console.log('✅ All cities already have proper country relationships!');
      return;
    }

    // Step 2: Get all countries for mapping
    console.log('🗺️  Step 2: Loading all countries...');
    const allCountries = await prisma.country.findMany();
    const countryMap = new Map();
    
    allCountries.forEach(country => {
      countryMap.set(country.code, country);
      countryMap.set(country.cca3, country);
    });

    console.log(`Loaded ${allCountries.length} countries\n`);

    // Step 3: Fix each city
    console.log('🔨 Step 3: Fixing city relationships...');
    let fixed = 0;
    let failed = 0;

    for (const city of citiesWithoutCountry) {
      try {
        // Try to find country by countryCode
        let targetCountry = null;
        
        if (city.countryCode) {
          targetCountry = countryMap.get(city.countryCode) || 
                         countryMap.get(city.countryCode.toUpperCase());
        }

        // If not found by code, try some common mappings
        if (!targetCountry && city.name) {
          const cityName = city.name.toLowerCase();
          
          // Common city-country mappings
          const cityCountryMap = {
            'london': 'GB',
            'paris': 'FR', 
            'berlin': 'DE',
            'madrid': 'ES',
            'rome': 'IT',
            'amsterdam': 'NL',
            'brussels': 'BE',
            'vienna': 'AT',
            'prague': 'CZ',
            'budapest': 'HU',
            'warsaw': 'PL',
            'stockholm': 'SE',
            'oslo': 'NO',
            'copenhagen': 'DK',
            'helsinki': 'FI',
            'dublin': 'IE',
            'lisbon': 'PT',
            'athens': 'GR',
            'moscow': 'RU',
            'istanbul': 'TR',
            'delhi': 'IN',
            'mumbai': 'IN',
            'bangalore': 'IN',
            'tokyo': 'JP',
            'beijing': 'CN',
            'shanghai': 'CN',
            'hong kong': 'CN',
            'singapore': 'SG',
            'sydney': 'AU',
            'melbourne': 'AU',
            'auckland': 'NZ',
            'toronto': 'CA',
            'vancouver': 'CA',
            'montreal': 'CA',
            'new york': 'US',
            'los angeles': 'US',
            'chicago': 'US',
            'san francisco': 'US',
            'miami': 'US',
            'boston': 'US',
            'seattle': 'US',
            'las vegas': 'US',
            'mexico city': 'MX',
            'buenos aires': 'AR',
            'são paulo': 'BR',
            'rio de janeiro': 'BR',
            'cape town': 'ZA',
            'cairo': 'EG',
            'lagos': 'NG',
            'nairobi': 'KE',
            'dubai': 'AE',
            'tel aviv': 'IL',
            'jerusalem': 'IL'
          };

          const countryCode = cityCountryMap[cityName];
          if (countryCode) {
            targetCountry = countryMap.get(countryCode) || 
                           countryMap.get(countryCode.toUpperCase());
          }
        }

        if (targetCountry) {
          // Update the city with the country reference
          await prisma.city.update({
            where: { id: city.id },
            data: { countryRefId: targetCountry.id }
          });

          console.log(`✅ Fixed: ${city.name} → ${targetCountry.name}`);
          fixed++;
        } else {
          console.log(`❌ Could not find country for: ${city.name} (code: ${city.countryCode})`);
          failed++;
        }

      } catch (error) {
        console.log(`❌ Error fixing ${city.name}:`, error.message);
        failed++;
      }
    }

    console.log(`\n📈 SUMMARY:`);
    console.log(`Total cities with issues: ${citiesWithoutCountry.length}`);
    console.log(`Successfully fixed: ${fixed}`);
    console.log(`Failed to fix: ${failed}`);

    // Step 4: Verify the fixes
    console.log('\n🔍 Step 4: Verifying fixes...');
    const remainingIssues = await prisma.city.findMany({
      where: {
        OR: [
          { countryRefId: null },
          { country: null }
        ]
      },
      include: { country: true },
      take: 10
    });

    if (remainingIssues.length === 0) {
      console.log('✅ All city-country relationships are now fixed!');
    } else {
      console.log(`⚠️  Still ${remainingIssues.length} cities have issues (showing first 10):`);
      remainingIssues.forEach(city => {
        console.log(`   - ${city.name} (countryRefId: ${city.countryRefId})`);
      });
    }

  } catch (error) {
    console.error('❌ Error fixing city-country relationships:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixCityCountryRelationships();
