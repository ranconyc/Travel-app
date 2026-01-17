import Block from "@/app/components/common/Block";
import Button from "@/app/components/common/Button";
import Title from "@/app/components/Title";
import { City } from "@/domain/city/city.schema";
import { PlaneTakeoff } from "lucide-react";

type NextDestination = {
  city: City;
  arrivalDate: string;
  departureDate: string;
};

type Props = {
  isYourProfile: boolean;
  nextDestinations: NextDestination[] | [];
};

export const NextDestinationsSection = ({
  nextDestinations,
  isYourProfile,
}: Props) => {
  return nextDestinations.length > 0 ||
    (isYourProfile && nextDestinations.length === 0) ? (
    <Block>
      <Title icon={<PlaneTakeoff size={22} />}>Next destinations</Title>
      <div>
        <h1 className="font-bold">New York, USA</h1>
        <p>Dec 17–21, 2025</p>
      </div>
      {isYourProfile && <Button>Plan your next destination</Button>}
    </Block>
  ) : null;
};
