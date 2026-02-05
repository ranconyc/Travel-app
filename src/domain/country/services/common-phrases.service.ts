import { Phrase } from "@/components/molecules/PhraseCard";
import phrasesData from "@/data/world/common_phrases.json";

interface PhraseData {
  label: string;
  local: string;
  romanized?: string;
  category: "Basics" | "Dining" | "Emergency" | "Transport";
}

interface CommonPhrasesData {
  commonPhrases: Record<string, PhraseData[]>;
}

class CommonPhrasesService {
  private data: CommonPhrasesData;

  constructor() {
    this.data = phrasesData as CommonPhrasesData;
  }

  /**
   * Get phrases for a specific language code
   */
  getPhrasesForLanguage(languageCode: string): Phrase[] {
    const phrases = this.data.commonPhrases[languageCode.toLowerCase()];
    
    if (!phrases) {
      return [];
    }

    return phrases.map((phrase: PhraseData): Phrase => ({
      label: phrase.label,
      local: phrase.local,
      romanized: phrase.romanized,
      category: phrase.category
    }));
  }

  /**
   * Get phrases grouped by category for a language
   */
  getPhrasesByCategory(languageCode: string): Record<string, Phrase[]> {
    const phrases = this.getPhrasesForLanguage(languageCode);
    
    return phrases.reduce((acc, phrase) => {
      if (!acc[phrase.category]) {
        acc[phrase.category] = [];
      }
      acc[phrase.category].push(phrase);
      return acc;
    }, {} as Record<string, Phrase[]>);
  }

  /**
   * Get basic phrases for a language (Basics category)
   */
  getBasicPhrases(languageCode: string): Phrase[] {
    const phrases = this.getPhrasesForLanguage(languageCode);
    return phrases.filter(phrase => phrase.category === "Basics");
  }

  /**
   * Check if phrases exist for a language
   */
  hasPhrasesForLanguage(languageCode: string): boolean {
    return !!this.data.commonPhrases[languageCode.toLowerCase()];
  }

  /**
   * Get all available language codes
   */
  getAvailableLanguages(): string[] {
    return Object.keys(this.data.commonPhrases);
  }

  /**
   * Get phrases for multiple languages (fallback logic)
   */
  getPhrasesWithFallback(languageCodes: string[]): Phrase[] {
    for (const code of languageCodes) {
      const phrases = this.getPhrasesForLanguage(code);
      if (phrases.length > 0) {
        return phrases;
      }
    }
    return [];
  }
}

export const commonPhrasesService = new CommonPhrasesService();
export default commonPhrasesService;
