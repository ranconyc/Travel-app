import { VisaRequirement, VisaData, UserVisaStatus } from "@/types/visa.types";
import visaData from "@/data/world/visas.json";

class VisaService {
  private data: VisaData;

  constructor() {
    this.data = visaData as VisaData;
  }

  /**
   * Get visa requirements for a specific country by its ISO code
   */
  getVisaRequirement(countryCode: string): VisaRequirement | null {
    const requirement = this.data.visaRequirements[countryCode.toUpperCase()];

    if (!requirement) {
      return this.data.defaultRequirement || null;
    }

    return requirement;
  }

  /**
   * Get personalized visa status based on user's passport country
   * Returns null if user is from the same country (no visa needed)
   */
  getUserVisaStatus(
    destinationCode: string,
    passportCode: string,
  ): UserVisaStatus | null {
    const passport = passportCode.toUpperCase();
    const destination = destinationCode.toUpperCase();

    // Edge case: User is from this country — no visa needed
    if (passport === destination) {
      return null;
    }

    const requirement = this.getVisaRequirement(destinationCode);
    const restrictions = requirement?.restrictions;

    // Priority order checking (per spec)
    // 1. Forbidden/Banned
    if (restrictions?.forbiddenPassports?.includes(passport)) {
      return {
        type: "restricted",
        label: "Entry Banned",
        description:
          "Your passport is currently restricted from entering this country.",
        color: "black",
      };
    }

    // 2. Visa-free
    if (restrictions?.visaFreePassports?.includes(passport)) {
      return {
        type: "success",
        label: "Good to Go",
        description:
          "No visa required! You can enter freely with your passport.",
        color: "green",
      };
    }

    // 3. e-Visa or On-Arrival
    if (
      restrictions?.eVisaPassports?.includes(passport) ||
      restrictions?.onArrivalPassports?.includes(passport)
    ) {
      const isEVisa = restrictions?.eVisaPassports?.includes(passport);
      return {
        type: "warning",
        label: "Action Needed",
        description: isEVisa
          ? "You need to apply for an e-Visa before traveling."
          : "You can get a visa on arrival at the airport.",
        color: "orange",
      };
    }

    // 4. Embassy visa required
    if (restrictions?.visaRequiredPassports?.includes(passport)) {
      return {
        type: "error",
        label: "Visa Required",
        description:
          "You need to apply for a visa at the embassy before traveling.",
        color: "red",
      };
    }

    // 5. Unknown — passport not in any list
    return {
      type: "unknown",
      label: "Check Requirements",
      description:
        "Please check the official embassy website for visa requirements.",
      color: "blue",
    };
  }

  /**
   * Get all visa requirements
   */
  getAllVisaRequirements(): Record<string, VisaRequirement> {
    return this.data.visaRequirements;
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
