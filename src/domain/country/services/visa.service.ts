import { VisaRequirement, VisaData } from "@/types/visa.types";
import visaData from "@/data/world/visas.json";

class VisaService {
  private data: VisaData;

  constructor() {
    this.data = visaData as VisaData;
  }

  /**
   * Get visa requirements for a specific country by its ISO code
   */
  getVisaRequirement(countryCode: string): VisaRequirement {
    const requirement = this.data.visaRequirements[countryCode.toUpperCase()];
    
    if (!requirement) {
      // Return default requirement for countries not in our list
      return this.data.defaultRequirement;
    }

    return requirement;
  }

  /**
   * Get all visa requirements
   */
  getAllVisaRequirements(): Record<string, VisaRequirement> {
    return this.data.visaRequirements;
  }

  /**
   * Get default requirement for unknown countries
   */
  getDefaultRequirement(): VisaRequirement {
    return this.data.defaultRequirement;
  }

  /**
   * Check if a country has specific visa data
   */
  hasVisaData(countryCode: string): boolean {
    return !!this.data.visaRequirements[countryCode.toUpperCase()];
  }
}

export const visaService = new VisaService();
export default visaService;
