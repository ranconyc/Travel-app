import Block from "@/app/component/common/Block";
import Title from "@/app/component/Title";
import { MapPinHouse, VenusAndMars, Venus, Mars } from "lucide-react";
import { getAge } from "@/app/_utils/age";
import { ProfileUser } from "../../types";

function formatHomeBase(user: ProfileUser) {
  const city = user.homeBaseCity;
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
            {user.firstName + " " + user.lastName},{getAge(user.birthday) || ""}
          </Title>
          <div className="flex items-center gap-2 w-fit mb-2">
            <MapPinHouse size={22} />
            <h2 className="text-sm">{formatHomeBase(user)}</h2>
          </div>
        </div>
        {/* gender */}
        {user.gender === "MALE" ? (
          <Mars size={22} />
        ) : user.gender === "FEMALE" ? (
          <Venus size={22} />
        ) : (
          <VenusAndMars size={22} />
        )}
      </div>

      <p className="max-w-[50ch]">
        {user.description ||
          "Market hopper, temple lover, island-weekend enthusiast."}
      </p>
    </Block>
  );
};
