import { Avatar } from "@/app/components/common/Avatar";
import { User } from "@/domain/user/user.schema";

export default function TravelPartners({ partner }: { partner: User | null }) {
  if (!partner) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="header-2">Travel Partners</h2>
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
    </div>
  );
}
