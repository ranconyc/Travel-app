/**
 * Logistics-related TypeScript interfaces
 */

export interface LogisticsData {
  idd?: {
    root?: string;
    suffixes?: string[];
  };
  timezones?: string[];
  startOfWeek?: string;
  car?: {
    side?: string;
    signs?: string[];
  };
  electricity?: {
    voltage?: number;
    frequency?: number;
  };
  emergency?: {
    police?: string;
    ambulance?: string;
    fire?: string;
  };
}

export interface PlugType {
  type: string;
  voltage?: number;
  frequency?: number;
}

export interface TimezoneInfo {
  utc: string;
  display: string;
  offset?: string;
}
