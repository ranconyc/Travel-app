import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getCitiesArray(): Promise<string[]> {
  try {
    const cities = await prisma.city.findMany({
      select: {
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const cityNames = cities.map(city => city.name);
    
    console.log(`Found ${cities.length} cities in the database:`);
    console.log(cityNames);
    
    return cityNames;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function and output the array
getCitiesArray().then(cities => {
  console.log('\n=== CITIES ARRAY ===');
  console.log(JSON.stringify(cities, null, 2));
});
