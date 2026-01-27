import { PrismaClient } from '@prisma/client';
import { slugify } from '@/lib/utils/slugify';

const prisma = new PrismaClient();

async function createTestPlace() {
  try {
    // First, let's see if there are any cities to reference
    const cities = await prisma.city.findMany({ take: 1 });
    
    if (cities.length === 0) {
      console.log('No cities found. Please create a city first.');
      return;
    }

    const city = cities[0];
    console.log('Using city:', city.name);

    // Create a test place
    const testPlace = await prisma.place.create({
      data: {
        slug: slugify('test-place-bangkok'),
        name: 'Test Place Bangkok',
        type: 'RESTAURANT',
        categories: ['restaurant', 'food'],
        cityRefId: city.id,
        countryRefId: city.countryRefId,
        address: '123 Test Street, Bangkok',
        coords: {
          type: 'Point',
          coordinates: [100.5018, 13.7563] // Bangkok coordinates
        },
        rating: 4.5,
        reviewCount: 100,
        priceLevel: 2,
        tags: ['restaurant', 'thai_food', 'test'],
        summary: 'A test place for debugging the place routing.',
        imageHeroUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=2039',
        autoCreated: false,
        needsReview: false
      }
    });

    console.log('✅ Test place created successfully!');
    console.log('Place details:', {
      id: testPlace.id,
      name: testPlace.name,
      slug: testPlace.slug,
      url: `http://localhost:3001/place/${testPlace.slug}`
    });

  } catch (error) {
    console.error('❌ Error creating test place:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestPlace();
