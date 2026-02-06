// Visa Status Types for Personalized Checking

export type VisaStatusType =
  | "success"
  | "warning"
  | "error"
  | "restricted"
  | "unknown";

export type VisaStatusColor = "green" | "orange" | "red" | "black" | "blue";

export interface VisaRestrictions {
  forbiddenPassports: string[];
  visaFreePassports: string[];
  eVisaPassports: string[];
  onArrivalPassports: string[];
  visaRequiredPassports: string[];
}

export interface VisaRequirement {
  type: string;
  status: "success" | "warning" | "error" | "info";
  title: string;
  description: string;
  cost?: {
    amount: number;
    currency: string;
  };
  stay?: string;
  processingTime?: string;
  officialLink?: string;
  documentsRequired?: string[];
  notes?: string;
  updates2026?: string;
  passportValidityRequired?: number;
  restrictions?: VisaRestrictions;
}

export interface UserVisaStatus {
  type: VisaStatusType;
  label: string;
  description: string;
  color: VisaStatusColor;
}

export interface VisaData {
  visaRequirements: Record<string, VisaRequirement>;
  defaultRequirement?: VisaRequirement;
}
