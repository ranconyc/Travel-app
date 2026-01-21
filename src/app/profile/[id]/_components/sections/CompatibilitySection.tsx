import { Avatar } from "@/app/components/common/Avatar";

export default function CompatibilitySection({
  matchData,
}: {
  matchData: any;
}) {
  return (
    <div className="border border-surface p-4 rounded-xl flex flex-col gap-3">
      <h3 className="font-bold">Compatibility</h3>
      <p className="text-sm text-secondary">
        You and {matchData.user.name} are {matchData.score}% compatible
      </p>
      <div className="flex -space-x-3">
        <Avatar
          image={matchData.user.avatarUrl}
          name={matchData.user.name}
          border
        />
        <Avatar
          image={matchData.user.avatarUrl}
          name={matchData.user.name}
          border
        />
      </div>
    </div>
  );
}
