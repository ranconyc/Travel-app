/**
 * Country mapping for city-to-country relationships
 * Maps city names to their respective countries for proper slug generation
 */

export const cityToCountryMap: Record<string, string> = {
  // Europe
  "Amsterdam": "Netherlands",
  "Athens": "Greece",
  "Barcelona": "Spain",
  "Berlin": "Germany",
  "Brussels": "Belgium",
  "Budapest": "Hungary",
  "Copenhagen": "Denmark",
  "Dublin": "Ireland",
  "Florence": "Italy",
  "Istanbul": "Turkey",
  "Kyoto": "Japan",
  "London": "United Kingdom",
  "Lyon": "France",
  "Madrid": "Spain",
  "Milan": "Italy",
  "Moscow": "Russia",
  "Oslo": "Norway",
  "Paris": "France",
  "Prague": "Czech Republic",
  "Rome": "Italy",
  "Stockholm": "Sweden",
  "Vienna": "Austria",
  "Warsaw": "Poland",
  "Zurich": "Switzerland",
  
  // Asia
  "Bangkok": "Thailand",
  "Delhi": "India",
  "Dubai": "United Arab Emirates",
  "Mumbai": "India",
  "Seoul": "South Korea",
  "Singapore": "Singapore",
  "Tokyo": "Japan",
  
  // Americas
  "Cairo": "Egypt",
  "Los Angeles": "United States",
  "New York": "United States",
  "San Francisco": "United States",
  "Toronto": "Canada",
  
  // Oceania
  "Brisbane": "Australia",
  "Sydney": "Australia"
};

/**
 * List of major capital cities for priority assignment
 */
export const majorCapitals = [
  "Amsterdam", "Athens", "Bangkok", "Berlin", "Copenhagen", "Dublin", 
  "London", "Madrid", "Moscow", "Oslo", "Paris", "Prague", "Rome", 
  "Stockholm", "Tokyo", "Vienna", "Warsaw"
];

/**
 * Get country for a city
 */
export function getCountryForCity(cityName: string): string {
  return cityToCountryMap[cityName] || "Unknown";
}

/**
 * Check if city is a major capital
 */
export function isMajorCapital(cityName: string): boolean {
  return majorCapitals.includes(cityName);
}
