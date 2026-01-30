import AddSection from "@/components/molecules/AddSection";
import { Avatar } from "@/components/atoms/Avatar";
import { User } from "@/domain/user/user.schema";
import SectionHeader from "@/components/molecules/SectionHeader";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";

export default function TravelPartners({ partner }: { partner: User | null }) {
  return (
    <div className="flex flex-col gap-md">
      <SectionHeader title="Travel Partners" />

      {!partner ? (
        <AddSection
          title="Traveling without a partner?"
          link={{ href: `/profile/partner`, label: "Link your partner" }}
        />
      ) : (
        <Block className="flex items-center gap-md">
          <Avatar
            image={partner.avatarUrl || ""}
            alt={partner.name || ""}
            size={40}
          />
          <div>
            <Typography variant="h3">{partner.name}</Typography>
            <Typography variant="p">Frequent travel partner</Typography>
          </div>
        </Block>
      )}
    </div>
  );
}
