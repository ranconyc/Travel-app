import AddSection from "@/components/molecules/AddSection";
import { Avatar } from "@/components/molecules/Avatar";
import { User } from "@/domain/user/user.schema";
import SectionHeader from "@/components/molecules/SectionHeader";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";

export default function TravelPartners({ partner }: { partner: User | null }) {
  return (
    <Block className="flex flex-col gap-md">
      <SectionHeader title="Travel Partners" />

      {!partner ? (
        <AddSection
          title="Traveling without a partner?"
          link={{ href: "/profile/partner", label: "Link your partner" }}
        />
      ) : (
        <Block className="bg-surface/50 p-md rounded-xl border border-surface flex items-center gap-md">
          <Avatar
            image={partner.avatarUrl || ""}
            alt={partner.name || ""}
            size={40}
          />
          <Block>
            <Typography variant="p" className="text-sm font-bold">
              {partner.name}
            </Typography>
            <Typography variant="p" className="text-xs text-secondary">
              Frequent travel partner
            </Typography>
          </Block>
        </Block>
      )}
    </Block>
  );
}
