import Block from "@/app/components/common/Block";
import Title from "@/app/components/Title";
import { MapPinHouse, VenusAndMars, Venus, Mars } from "lucide-react";
import { getAge } from "@/app/_utils/age";
import { ProfileUser } from "@/types/user";

function formatHomeBase(user: ProfileUser) {
  const city = user.profile?.homeBaseCity;
  const country = city?.country;

  if (!city) return "No location set";

  const normalized =
    country?.name === "United States of America" ? "USA" : country?.name;

  return normalized ? `${city.name}, ${normalized}` : city.name;
}

export const InfoSection = ({ user }: { user: ProfileUser }) => {
  return (
    <Block>
      <div className="flex items-start justify-between">
        <div>
          <Title>
            {(user.profile?.firstName || "") +
              " " +
              (user.profile?.lastName || "")}
            ,{getAge(user.profile?.birthday) || ""}
          </Title>
          <div className="flex items-center gap-2 w-fit mb-2">
            <MapPinHouse size={22} />
            <h2 className="text-sm">{formatHomeBase(user)}</h2>
          </div>
        </div>
        {/* gender */}
        {user.profile?.gender === "MALE" ? (
          <Mars size={22} />
        ) : user.profile?.gender === "FEMALE" ? (
          <Venus size={22} />
        ) : (
          <VenusAndMars size={22} />
        )}
      </div>

      <p className="max-w-[50ch]">
        {user.profile?.description ||
          "Market hopper, temple lover, island-weekend enthusiast."}
      </p>
    </Block>
  );
};
