/**
 * Language-related TypeScript interfaces
 */

export interface Language {
  code: string;
  name: string;
  nativeName?: string;
}

export interface CommonPhrase {
  label: string;
  local?: string;
  romanized?: string;
  category?: "Basics" | "Dining" | "Emergency" | "Transport";
  audioUrl?: string;
}

export interface LanguageData {
  official: string[];
  spoken?: string[];
  nativeName?: string;
  codes?: string[];
}

export interface PhrasesByLanguage {
  [languageCode: string]: {
    phrases: CommonPhrase[];
  };
}
