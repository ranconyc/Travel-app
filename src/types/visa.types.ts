export interface VisaRequirement {
  type: string;
  allowedStay: string;
  status: "success" | "warning" | "error" | "info";
  title: string;
  description: string;
  cost?: {
    amount: number;
    currency: string;
  };
  processingTime?: string;
  officialLink?: string;
  documentsRequired?: string[];
  notes?: string;
}

export interface VisaData {
  visaRequirements: Record<string, VisaRequirement>;
  defaultRequirement: VisaRequirement;
}
