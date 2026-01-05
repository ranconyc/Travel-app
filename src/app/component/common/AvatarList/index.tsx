import { Avatar } from "../Avatar";

function OtherCountBadge({
  otherCount,
  size,
  badgeFontSize,
}: {
  otherCount: number;
  size: number;
  badgeFontSize: number;
}) {
  return (
    <div className="flex items-center">
      <span
        style={{
          width: size,
          height: size,
          fontSize: badgeFontSize,
        }}
        className="bg-black text-white font-bold rounded-full flex items-center justify-center"
      >
        +{otherCount}
      </span>
    </div>
  );
}

function AvatarMatchBadge({ percentage = 56 }: { percentage?: number }) {
  return (
    <div className="text-white pr-1 ">
      <h1 className="text-[12px] font-bold leading-[1.1]">{percentage}%</h1>
      <h2 className="text-[9px] font-bold uppercase leading-none">match</h2>
    </div>
  );
}

// Define a simpler interface for the avatar list item
// We don't need the full User object (which requires createdAt, etc.)
interface AvatarUser {
  id?: string; // made optional to match usage key={user.id ?? index}
  image?: string | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

type AvatarListProps = {
  list: AvatarUser[];
  maxVisible?: number; // how many avatars to show before "+N"
  size?: number; // avatar + badge size in px
  overlap?: number; // how much to overlap avatars (0.0 - 1.0)
  className?: string;
  showExtra?: boolean; // show or hide the +N badge
  showMatch?: boolean; // show or hide the match badge
  matchPercentage?: number;
};

export function AvatarList({
  list,
  maxVisible = 3,
  size = 32,
  // overlap = 0.35, // unused but kept in props type for docs
  className = "",
  showExtra = list.length > 2,
  showMatch,
  matchPercentage,
}: AvatarListProps) {
  // nothing to show
  if (!list || list.length === 0) return null;

  const visibleUsers = list.slice(0, maxVisible);
  const otherCount = Math.max(0, list.length - maxVisible);
  const badgeFontSize = Math.max(10, size * 0.45); // keep text readable

  return (
    <div
      className={`flex items-center gap-2 justify-center w-fit bg-gray-800/30 backdrop-blur-sm  rounded-full px-2 py-1 ${className}`}
    >
      {/* avatar stack */}
      <div className="flex items-center ">
        {visibleUsers.map((user, index) => {
          // Determine the display name: prefer 'name', then 'firstName lastName', then fallback
          const displayName =
            user.name ||
            (user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.firstName || "User");

          return (
            <Avatar
              key={user.id ?? index}
              size={size}
              image={user.image || undefined}
              name={displayName}
              style={{
                marginLeft: index === 0 ? 0 : size * -0.45, // overlap only here
              }}
            />
          );
        })}
      </div>

      {/* "+N" badge */}
      {showExtra && otherCount > 0 && (
        <OtherCountBadge
          otherCount={otherCount}
          size={size}
          badgeFontSize={badgeFontSize}
        />
      )}
      {showMatch && <AvatarMatchBadge percentage={matchPercentage} />}
    </div>
  );
}
