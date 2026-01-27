/**
 * Maps ISO3 country codes to their primary language codes
 * This service bridges the gap between country URLs (ISO3) and language data
 */

class CountryLanguageMappingService {
  private countryToLanguageMap: Record<string, string[]> = {
    // Asia
    "ISR": ["he"], // Israel -> Hebrew
    "THA": ["th"], // Thailand -> Thai
    "JPN": ["ja"], // Japan -> Japanese
    "KOR": ["ko"], // South Korea -> Korean
    "CHN": ["zh"], // China -> Chinese
    "IND": ["hi"], // India -> Hindi
    "VNM": ["vi"], // Vietnam -> Vietnamese
    "SGP": ["en"], // Singapore -> English
    "MYS": ["ms"], // Malaysia -> Malay
    "IDN": ["id"], // Indonesia -> Indonesian
    "PHL": ["en"], // Philippines -> English
    "TWN": ["zh"], // Taiwan -> Chinese
    
    // Europe
    "FRA": ["fr"], // France -> French
    "DEU": ["de"], // Germany -> German
    "ITA": ["it"], // Italy -> Italian
    "ESP": ["es"], // Spain -> Spanish
    "GBR": ["en"], // United Kingdom -> English
    "NLD": ["nl"], // Netherlands -> Dutch
    "BEL": ["nl", "fr"], // Belgium -> Dutch, French
    "CHE": ["de"], // Switzerland -> German
    "AUT": ["de"], // Austria -> German
    "PRT": ["pt"], // Portugal -> Portuguese
    "GRC": ["el"], // Greece -> Greek
    "RUS": ["ru"], // Russia -> Russian
    "TUR": ["tr"], // Turkey -> Turkish
    "POL": ["pl"], // Poland -> Polish
    "CZE": ["cs"], // Czech Republic -> Czech
    "HUN": ["hu"], // Hungary -> Hungarian
    "SWE": ["sv"], // Sweden -> Swedish
    "NOR": ["no"], // Norway -> Norwegian
    "DNK": ["da"], // Denmark -> Danish
    "FIN": ["fi"], // Finland -> Finnish
    
    // Americas
    "USA": ["en"], // United States -> English
    "CAN": ["en", "fr"], // Canada -> English, French
    "MEX": ["es"], // Mexico -> Spanish
    "BRA": ["pt"], // Brazil -> Portuguese
    "ARG": ["es"], // Argentina -> Spanish
    "CHL": ["es"], // Chile -> Spanish
    "PER": ["es"], // Peru -> Spanish
    "COL": ["es"], // Colombia -> Spanish
    "VEN": ["es"], // Venezuela -> Spanish
    "ECU": ["es"], // Ecuador -> Spanish
    
    // Middle East & North Africa
    "EGY": ["ar"], // Egypt -> Arabic
    "SAU": ["ar"], // Saudi Arabia -> Arabic
    "ARE": ["ar"], // UAE -> Arabic
    "JOR": ["ar"], // Jordan -> Arabic
    "LBN": ["ar"], // Lebanon -> Arabic
    "SYR": ["ar"], // Syria -> Arabic
    "IRQ": ["ar"], // Iraq -> Arabic
    "IRN": ["fa"], // Iran -> Persian (Farsi)
    "AFG": ["ps"], // Afghanistan -> Pashto
    
    // Africa
    "ZAF": ["en", "af"], // South Africa -> English, Afrikaans
    "NGA": ["en"], // Nigeria -> English
    "KEN": ["en", "sw"], // Kenya -> English, Swahili
    "MAR": ["ar"], // Morocco -> Arabic
    "TUN": ["ar"], // Tunisia -> Arabic
    "DZA": ["ar"], // Algeria -> Arabic
    
    // Oceania
    "AUS": ["en"], // Australia -> English
    "NZL": ["en"], // New Zealand -> English
  };

  /**
   * Get primary language codes for a country (ISO3 code)
   */
  getLanguagesForCountry(countryIso3: string): string[] {
    return this.countryToLanguageMap[countryIso3.toUpperCase()] || [];
  }

  /**
   * Get the first (primary) language code for a country
   */
  getPrimaryLanguageForCountry(countryIso3: string): string | null {
    const languages = this.getLanguagesForCountry(countryIso3);
    return languages.length > 0 ? languages[0] : null;
  }

  /**
   * Check if we have language mapping for a country
   */
  hasLanguageMapping(countryIso3: string): boolean {
    return !!this.countryToLanguageMap[countryIso3.toUpperCase()];
  }

  /**
   * Get all supported country codes
   */
  getSupportedCountries(): string[] {
    return Object.keys(this.countryToLanguageMap);
  }

  /**
   * Add or update a country language mapping
   */
  addCountryLanguageMapping(countryIso3: string, languageCodes: string[]): void {
    this.countryToLanguageMap[countryIso3.toUpperCase()] = languageCodes;
  }
}

export const countryLanguageMappingService = new CountryLanguageMappingService();
export default countryLanguageMappingService;