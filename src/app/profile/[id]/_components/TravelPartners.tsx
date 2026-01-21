import Link from "next/link";
import { User } from "@/domain/user/user.schema";

const NoPartnerMessage = () => {
  return (
    <p className="text-sm text-secondary py-4">
      Traveling with someone? Add your travel partner here!
      <Link
        href="/profile/travel-partners"
        className="ml-2 text-brand font-bold"
      >
        Add partner
      </Link>
    </p>
  );
};

const PartnerLink = ({ partner }: { partner: User }) => {
  return <Link href={`/profile/${partner.id}`}>{partner.name}</Link>;
};

export default function TravelPartners({ partner }: { partner?: User }) {
  return (
    <div>
      <h2 className="header-2">Travel Partners</h2>
      {partner ? <PartnerLink partner={partner} /> : <NoPartnerMessage />}
    </div>
  );
}
