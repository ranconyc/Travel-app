import { useProfileUser } from "../../store/useProfileStore";

export default function MatchSummary() {
  const profileUser = useProfileUser();
  return (
    <div className="flex flex-col items-center mb-10">
      <h1 className="text-[32px] font-bold">Compatibility</h1>
      <p className="text-lg font-bold">
        You and{" "}
        <span className="font-sora text-brand">
          {profileUser?.name?.split(" ")[0]}
        </span>{" "}
        both...
      </p>
    </div>
  );
}
