import Block from "@/components/atoms/Block";
import Title from "@/components/atoms/Title";
import { Languages } from "lucide-react";

const subtitle = "text-sm font-medium capitalize mb-1";
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

type UsefulPhrasesProps = { usefulPhrases: { en: string; local: string }[] };

const UsefulPhrases = ({ usefulPhrases }: UsefulPhrasesProps) => {
  return (
    <div>
      <h2 className={subtitle}>useful phrases</h2>
      <div className="grid gap-2">
        {usefulPhrases.map((p) => (
          <div className={flexBetween} key={p.en}>
            <p className="text-gray-500 text-sm">{p.en}</p>
            <p className="text-gray-900 text-sm">{p.local}</p>
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
    <h2 className={subtitle}>English Proficiency</h2>
    <p className=" text-sm">{englishProficiencyNote}</p>
  </div>
);

type LanguageProps = {
  usefulPhrases: UsefulPhrasesProps["usefulPhrases"];
  englishProficiencyNote: EnglishProficiencyProps["englishProficiencyNote"];
  languageNative?: SpokenLanguagesProps["languageNative"];
  languagesEnglish?: SpokenLanguagesProps["languagesEnglish"];
};

export default function LanguageSection({
  usefulPhrases,
  englishProficiencyNote,
  languagesEnglish,
  languageNative,
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
      <UsefulPhrases usefulPhrases={usefulPhrases} />
      <EnglishProficiency englishProficiencyNote={englishProficiencyNote} />
    </Block>
  );
}
