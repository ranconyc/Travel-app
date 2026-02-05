const fs = require("fs");
const path = require("path");

async function createCapitals() {
  const filePath = path.join(
    process.cwd(),
    "src/data/countries+states+cities.json",
  );
  const data = fs.readFileSync(filePath, "utf-8");
  const countries = JSON.parse(data);

  const capitals = [];

  for (const country of countries) {
    if (country.capital) {
      // Try to find the capital city in the nested cities list to get its ID/Coords
      let foundCity = null;
      for (const state of country.states) {
        for (const city of state.cities) {
          if (city.name === country.capital) {
            foundCity = city;
            break;
          }
        }
        if (foundCity) break;
      }

      if (foundCity) {
        capitals.push({
          countryName: country.name,
          capitalName: country.capital,
          jsonCityId: foundCity.id,
          foundInJson: true,
        });
      } else {
        // Capital exists in country data but not found in the cities list
        // We will have to Geocode this one or skip
        capitals.push({
          countryName: country.name,
          capitalName: country.capital,
          foundInJson: false,
        });
      }
    }
  }

  console.log(JSON.stringify(capitals, null, 2));
}

createCapitals();
