const fs = require('fs');
const path = require('path');

const interestsPath = path.join(__dirname, '../../data/interests.json');
const interestsData = JSON.parse(fs.readFileSync(interestsPath, 'utf8'));

const getInterestLabel = (interestId) => {
  for (const catKey in interestsData) {
    const category = interestsData[catKey];
    const foundItem = category.items?.find((item) => item.id === interestId);
    if (foundItem) {
      return foundItem.label;
    }
  }
  return interestId;
};

const testIds = [
  'street_food_markets',
  'fine_dining',
  'surfing', 
  'yoga_meditation',
  'non_existent_id'
];

console.log('--- Verification Results ---');
testIds.forEach(id => {
  console.log(`ID: ${id} -> Label: ${getInterestLabel(id)}`);
});
