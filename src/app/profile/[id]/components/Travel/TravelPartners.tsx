import AddSection from "@/app/components/common/AddSection";
import { Avatar } from "@/app/components/common/Avatar";
import { User } from "@/domain/user/user.schema";
import Link from "next/link";

export default function TravelPartners({ partner }: { partner: User | null }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="header-2">Travel Partners</h2>
      {!partner ? (
        <AddSection
          title="Traveling without a partner?"
          link={{ href: "/profile/partner", label: "Link your partner" }}
        />
      ) : (
        <div className="bg-surface/50 p-4 rounded-xl border border-surface flex items-center gap-4">
          <Avatar
            image={partner.avatarUrl || ""}
            name={partner.name || ""}
            size={40}
          />
          <div>
            <p className="text-sm font-bold">{partner.name}</p>
            <p className="text-xs text-secondary">Frequent travel partner</p>
          </div>
        </div>
      )}
    </div>
  );
}
