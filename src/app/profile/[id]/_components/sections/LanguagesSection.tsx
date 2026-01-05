import Block from "@/app/component/common/Block";
import Title from "@/app/component/Title";
import { Languages, BriefcaseBusiness } from "lucide-react";
import languages from "../../../../../data/languages.json";
import { ProfileUser } from "../../types";

export const LanguagesSection = ({
  user,
  isLoading,
}: {
  user: ProfileUser;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <Block>
        <Title icon={<Languages size={22} />}>Languages</Title>
        <p className="text-sm text-gray-500">Loading...</p>
      </Block>
    );
  }

  const langs =
    languages?.filter((lang) => user.languages?.includes(lang.code)) || [];

  return (
    <div className="grid grid-cols-2 gap-4">
      <Block>
        <Title icon={<Languages size={22} />}>Languages</Title>
        {langs.length === 0 && (
          <p className="text-sm text-gray-500">No languages yet</p>
        )}
        {langs.map((lang) => (
          <div key={lang.code} className="flex items-center gap-2">
            <div>{lang.flag}</div>
            <div>{lang.name}</div>
          </div>
        ))}
      </Block>
      <Block>
        <Title icon={<BriefcaseBusiness size={22} />}>Work</Title>
        <p>{user.occupation || "no data"}</p>
      </Block>
    </div>
  );
};
