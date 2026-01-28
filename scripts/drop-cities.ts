import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function dropAllCities() {
  try {
    console.log('⚠️  WARNING: About to delete ALL cities from the database');
    console.log('This will permanently remove all city records');
    
    // Count cities before deletion
    const count = await prisma.city.count();
    console.log(`Found ${count} cities in the database`);
    
    if (count === 0) {
      console.log('No cities to delete. Database is already empty.');
      return;
    }
    
    // Ask for confirmation (in a real script, you'd want user input)
    console.log('Proceeding with deletion...');
    
    // Delete all cities
    const result = await prisma.city.deleteMany({});
    
    console.log(`✅ Successfully deleted ${result.count} cities from the database`);
    console.log('All city records have been permanently removed');
    
  } catch (error) {
    console.error('❌ Error deleting cities:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the deletion
dropAllCities();
