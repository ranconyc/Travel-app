import formatLanguage from "@/domain/shared/utils/formatLanguage";
import BreakdownItem from "../compatibility/BreakdownItem";

export default function SimilarLanguages({
  languages,
}: {
  languages: string[];
}) {
  return (
    <BreakdownItem
      title="Speak"
      value={
        languages.length > 0
          ? languages.map((language) => formatLanguage(language)).join(" ")
          : "0"
      }
    />
  );
}
