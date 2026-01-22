import languages from "@/data/languages.json";
export default function formatLanguage(language: string) {
  return languages.find((lang) => lang.code === language)?.flag;
}
