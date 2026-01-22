import { Avatar } from "@/app/components/common/Avatar";
import { MatchResult } from "@/domain/match/match.schema";
import { useLoggedUser, useProfileUser } from "../../store/useProfileStore";

export default function MatchAvatar({
  matchResult,
}: {
  matchResult: MatchResult;
}) {
  const profileUser = useProfileUser();
  const loggedUser = useLoggedUser();
  if (!profileUser || !loggedUser) return null;
  return (
    <div className="relative flex -space-x-4 justify-center mb-4">
      <Avatar
        image={profileUser.avatarUrl ?? undefined}
        name={profileUser.name ?? ""}
        size={112}
      />
      <Avatar
        image={loggedUser.avatarUrl ?? undefined}
        name={loggedUser.name ?? ""}
        size={112}
      />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex bg-brand text-white rounded-full">
        <div className="w-14 h-14 rounded-full flex flex-col -space-y-1 items-center justify-center">
          <div className="text-[10px] font-bold uppercase">match</div>
          <div className="text-base font-bold font-sora">
            {matchResult?.score || 0}%
          </div>
        </div>
      </div>
    </div>
  );
}
