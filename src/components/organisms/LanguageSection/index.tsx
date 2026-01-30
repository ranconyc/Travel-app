import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import { Languages, BookOpen } from "lucide-react";
import { CommonPhrase } from "@/types/language.types";

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
      <Typography variant="ui-sm" className="capitalize">
        Spoken Language
      </Typography>
      <Typography variant="body-sm">{lang}</Typography>
    </div>
  );
}

type CommonPhrasesProps = {
  phrases: CommonPhrase[];
};

const CommonPhrases = ({ phrases }: CommonPhrasesProps) => {
  if (!phrases || phrases.length === 0) {
    return (
      <div>
        <Typography variant="ui-sm" className="mb-2">
          Common Phrases
        </Typography>
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
      <Typography variant="ui-sm" className="mb-2">
        Common Phrases
      </Typography>
      <div className="grid gap-2">
        {phrases.slice(0, 5).map((phrase: CommonPhrase, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 bg-main/50 rounded-xl group cursor-pointer hover:bg-main transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-brand">
                  {phrase?.label?.charAt(0) || "?"}
                </span>
              </div>
              <div>
                <Typography variant="ui-sm" color="main">
                  {phrase?.label || "Unknown phrase"}
                </Typography>
                <Typography variant="caption-sm" color="sec">
                  {phrase?.local || phrase?.romanized || ""}
                </Typography>
              </div>
            </div>
            <div className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </div>
          </div>
        ))}
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
    <Typography variant="ui-sm" className="mb-1">
      English Proficiency
    </Typography>
    <Typography variant="body-sm">{englishProficiencyNote}</Typography>
  </div>
);

type LanguageProps = {
  usefulPhrases?: { en: string; local: string }[];
  commonPhrases?: CommonPhrase[];
  englishProficiencyNote?: string;
  languageNative?: string;
  languagesEnglish?: string;
  primaryLanguageCode?: string;
};

export default function LanguageSection({
  usefulPhrases,
  commonPhrases,
  englishProficiencyNote,
  languagesEnglish,
  languageNative,
  primaryLanguageCode,
}: LanguageProps) {
  return (
    <Block>
      <div className="flex items-center gap-2 mb-2">
        <Languages size={16} />
        <Typography variant="h3" weight="bold" className="w-fit capitalize">
          Language & Communication
        </Typography>
      </div>
      {languagesEnglish && (
        <SpokenLanguages
          languagesEnglish={languagesEnglish}
          languageNative={languageNative}
        />
      )}

      {/* New Common Phrases Section */}
      {commonPhrases && commonPhrases.length > 0 && (
        <CommonPhrases phrases={commonPhrases} />
      )}

      {/* Legacy Useful Phrases (fallback) */}
      {usefulPhrases && !primaryLanguageCode && (
        <div>
          <Typography variant="ui-sm" className="mb-2 uppercase">
            useful phrases
          </Typography>
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
