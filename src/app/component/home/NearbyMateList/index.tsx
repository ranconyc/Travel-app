import { User } from "../../../../domain/user/user.schema";
import { sectionTitle } from "../HomeLoggedIn";
import MateCard from "../../common/cards/MateCard";

type Props = { mates: any; loggedUser: User };
export default function NearbyMateList({ mates, loggedUser }: Props) {
  const { currentCityId, homeBaseCityId } = mates;
  return (
    <>
      <h1 className={sectionTitle}>Nearby Travelers</h1>

      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory">
        {mates.map((mate: User, index: number) => (
          <div className="snap-start" key={mate.id}>
            <MateCard
              mate={mate}
              priority={index > 3}
              loggedUser={loggedUser}
            />
          </div>
        ))}
      </div>
    </>
  );
}
