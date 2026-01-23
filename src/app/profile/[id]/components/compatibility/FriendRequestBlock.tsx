import Button from "@/app/components/common/Button";
import MatchAvatars from "./MatchAvatars";
import { UserRoundCheck, UserRoundX } from "lucide-react";

export default function FriendRequestBlock({}) {
  return (
    <div>
      <MatchAvatars />
      <h2 className="text-md">
        <span className="text-brand">eddie wants to be your friend</span>
      </h2>
      <div className="flex gap-4">
        <Button icon={<UserRoundX size={20} />} className="w-full" />
        <Button icon={<UserRoundCheck size={20} className="w-full" />} />
      </div>
    </div>
  );
}
