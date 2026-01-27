import Block from "@/components/atoms/Block";
import Title from "@/components/atoms/Title";
import { Languages, BookOpen, ChevronRight } from "lucide-react";
import PhraseCard from "@/components/molecules/PhraseCard";
import { commonPhrasesService } from "@/services/common-phrases.service";
import { CommonPhrase, LanguageData } from "@/types/language.types";

const subtitle = "text-ui-sm capitalize mb-1";
const flexBetween = "flex items-center justify-between";

type SpokenLanguagesProps = {
  languagesEnglish: string;
  languageNative?: string;
};

export function SpokenLanguages({
  languagesEnglish,
  languageNative,
}: SpokenLanguagesProps) {
  const lang = languageNative
    ? `${languagesEnglish} / ${languageNative}`
    : languagesEnglish;

  return (
    <div className={flexBetween}>
      <h2 className={subtitle}>Spoken Language</h2>
      <p className="text-sm">{lang}</p>
    </div>
  );
}

type CommonPhrasesProps = {
  languageCode: string;
  data: any;
};

const CommonPhrases = ({ languageCode, data }: CommonPhrasesProps) => {
  const phrases = commonPhrasesService.getPhrasesForLanguage(languageCode);

  if (!phrases.length) {
    return (
      <div>
        <h2 className={subtitle}>Common Phrases</h2>
        <div className="flex items-center gap-3 p-4 bg-surface-secondary/30 rounded-lg">
          <BookOpen className="w-5 h-5 text-secondary" />
          <div>
            <p className="text-ui-sm text-txt-main">Learn the basics</p>
            <p className="text-xs text-secondary">
              Essential phrases coming soon for this language
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className={subtitle}>Common Phrases</h2>
      <div className="grid gap-2">
        {Array.isArray(data?.commonPhrases)
          ? data.commonPhrases.slice(0, 5).map((phrase: CommonPhrase, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-main/50 rounded-xl group cursor-pointer hover:bg-main transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-brand">
                      {phrase?.label?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-ui-sm text-txt-main">
                      {phrase?.label || 'Unknown phrase'}
                    </p>
                    <p className="text-xs text-secondary">
                      {phrase?.local || phrase?.romanized || ''}
                    </p>
                  </div>
                </div>
                <div className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            ))
          : (
            <div className="text-sm text-secondary p-3">
              No phrases available
            </div>
          )}
      </div>
    </div>
  );
};

type EnglishProficiencyProps = {
  englishProficiencyNote: string;
};

const EnglishProficiency = ({
  englishProficiencyNote,
}: EnglishProficiencyProps) => (
  <div>
    <h2 className={subtitle}>English Proficiency</h2>
    <p className=" text-sm">{englishProficiencyNote}</p>
  </div>
);

type LanguageProps = {
  usefulPhrases?: { en: string; local: string }[];
  englishProficiencyNote?: string;
  languageNative?: string;
  languagesEnglish?: string;
  primaryLanguageCode?: string;
};

export default function LanguageSection({
  usefulPhrases,
  englishProficiencyNote,
  languagesEnglish,
  languageNative,
  primaryLanguageCode,
}: LanguageProps) {
  
  return (
    <Block>
      <Title icon={<Languages size={16} />}>Language & Communication</Title>
      {languagesEnglish && (
        <SpokenLanguages
          languagesEnglish={languagesEnglish}
          languageNative={languageNative}
        />
      )}
      
      {/* New Common Phrases Section */}
      {primaryLanguageCode && (
        <CommonPhrases languageCode={primaryLanguageCode} data={usefulPhrases} />
      )}
      
      {/* Legacy Useful Phrases (fallback) */}
      {usefulPhrases && !primaryLanguageCode && (
        <div>
          <h2 className={subtitle}>useful phrases</h2>
          <div className="grid gap-2">
            {usefulPhrases.map((p) => (
              <div className={flexBetween} key={p.en}>
                <p className="text-secondary text-sm">{p.en}</p>
                <p className="text-gray-900 text-sm">{p.local}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {englishProficiencyNote && (
        <EnglishProficiency englishProficiencyNote={englishProficiencyNote} />
      )}
    </Block>
  );
}
