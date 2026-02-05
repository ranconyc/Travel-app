const fs = require('fs');
const path = require('path');

const interestsPath = path.join(__dirname, '../../data/interests.json');
const interestsData = JSON.parse(fs.readFileSync(interestsPath, 'utf8'));

const userList = [
  'Surfing', 'museums', 'spa_massage', 'Scuba diving', 'volunteering', 
  'art_galleries', 'Shopping malls', 'City viewpoints', 'traveler_meetups', 
  'Live music venues', 'Historic landmarks', 'cultural_festivals', 
  'Street food markets', 'Wine & Brewery tours', 'Nightclubs & Dancing', 
  'National park hiking', 'Instagrammable spots', 'Local artisan markets'
];

console.log('--- Analysis of User List ---');

const allItems = [];
Object.values(interestsData).forEach(cat => {
  if (cat.items) allItems.push(...cat.items);
});

userList.forEach(item => {
  const exactIdMatch = allItems.find(i => i.id === item);
  const exactLabelMatch = allItems.find(i => i.label === item);
  
  if (exactIdMatch) {
    console.log(`✅ ID Match: "${item}"`);
  } else if (exactLabelMatch) {
    console.log(`⚠️ Label Match: "${item}" (ID is "${exactLabelMatch.id}")`);
  } else {
    // Try to find partial matches or guesses
    const partialMatch = allItems.find(i => i.id.includes(item.toLowerCase()) || item.toLowerCase().includes(i.id));
    if (partialMatch) {
        console.log(`❌ No Match: "${item}" (Did you mean ID "${partialMatch.id}"?)`);
    } else {
        console.log(`❌ No Match: "${item}"`);
    }
  }
});
