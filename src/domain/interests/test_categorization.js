const fs = require('fs');
const path = require('path');

const interestsPath = path.join(__dirname, '../../data/interests.json');
const interestsData = JSON.parse(fs.readFileSync(interestsPath, 'utf8'));

// Re-implementing the function locally to test exact logic 
// (or I could import if I compiled, but this is faster/safer for quick verification)
const getSelectedInterestsByCategory = (selectedKeys) => {
  const result = {};

  if (!selectedKeys || selectedKeys.length === 0) return result;

  Object.values(interestsData).forEach((category) => {
    const matchedItems = category.items
      .filter((item) => selectedKeys.includes(item.id))
      .map((item) => item.label);

    if (matchedItems.length > 0) {
      result[category.label] = matchedItems;
    }
  });

  return result;
};

// Also test a 'smart' version that matches by ID OR Label, just to show the user what they might want
const getSelectedInterestsByCategorySmart = (selectedKeys) => {
  const result = {};

  if (!selectedKeys || selectedKeys.length === 0) return result;

  Object.values(interestsData).forEach((category) => {
    const matchedItems = category.items
      .filter((item) => selectedKeys.includes(item.id) || selectedKeys.includes(item.label))
      .map((item) => item.label);

    if (matchedItems.length > 0) {
      result[category.label] = matchedItems;
    }
  });

  return result;
};


const testArray = [
  'Surfing', 
  'museums', 
  'spa_massage', 
  'Scuba diving', 
  'volunteering', 
  'art_galleries', 
  'Shopping malls', 
  'City viewpoints', 
  'traveler_meetups', 
  'Live music venues', 
  'Historic landmarks', 
  'cultural_festivals', 
  'Street food markets', 
  'Wine & Brewery tours', 
  'Nightclubs & Dancing', 
  'National park hiking', 
  'Instagrammable spots', 
  'Local artisan markets'
];

console.log("--- Current Implementation (Expects IDs) ---");
console.log(JSON.stringify(getSelectedInterestsByCategory(testArray), null, 2));

console.log("\n--- 'Smart' Implementation (Checks IDs OR Labels) ---");
console.log(JSON.stringify(getSelectedInterestsByCategorySmart(testArray), null, 2));
