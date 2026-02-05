import { Avatar } from "@/components/atoms/Avatar";
import {
  useLoggedUser,
  useProfileUser,
  useMatchResult,
} from "../../store/useProfileStore";

const Score = ({
  score,
  variant = "circle",
}: {
  score: number;
  variant: "circle" | "ovel";
}) => (
  <div
    className={`flex ${variant === "circle" ? "w-14 h-14 flex-col -space-y-1" : "flex-row-reverse gap-1 px-4 py-2"}  items-center justify-center`}
  >
    <div
      className={`${variant === "circle" ? "text-micro" : "text-p"} font-bold uppercase`}
    >
      match
    </div>
    <div className="text-p font-bold font-sora">{score || 0}%</div>
  </div>
);

export default function MatchAvatars({ size = 112 }: { size?: number }) {
  const profileUser = useProfileUser();
  const loggedUser = useLoggedUser();
  const matchResult = useMatchResult();

  if (!profileUser || !loggedUser || !matchResult) return null;

  return (
    <div className="relative flex -space-x-4 justify-center mb-md">
      <Avatar
        image={profileUser.avatarUrl ?? undefined}
        alt={profileUser.name ?? ""}
        size={size}
      />
      <Avatar
        image={loggedUser.avatarUrl ?? undefined}
        alt={loggedUser.name ?? ""}
        size={size}
      />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex bg-brand text-white rounded-full">
        <Score score={matchResult.score} variant="ovel" />
      </div>
    </div>
  );
}
