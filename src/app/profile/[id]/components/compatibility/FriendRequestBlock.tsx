import Button from "@/components/atoms/Button";
import MatchAvatars from "./MatchAvatars";
import { UserRoundCheck, UserRoundX } from "lucide-react";

export default function FriendRequestBlock() {
  return (
    <div className="w-full bg-bg-card p-md flex flex-col gap-md rounded-card shadow-soft border border-stroke">
      <h2 className="text-p text-center text-txt-main">
        <span className="text-brand capitalize font-bold">Eddie </span>
        wants to be your friend
      </h2>
      <MatchAvatars size={80} />
      <div className="flex gap-md">
        <Button
          icon={<UserRoundX size={20} />}
          className="flex-1"
          variant="outline"
          size="lg"
        >
          Reject
        </Button>
        <Button
          icon={<UserRoundCheck size={20} />}
          className="flex-1"
          variant="brand"
          size="lg"
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
