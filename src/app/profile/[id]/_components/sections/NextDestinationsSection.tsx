import Block from "@/app/component/common/Block";
import Button from "@/app/component/common/Button";
import Title from "@/app/component/Title";
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
