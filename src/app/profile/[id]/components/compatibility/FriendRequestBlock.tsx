import Button from "@/components/atoms/Button";
import MatchAvatars from "./MatchAvatars";
import { UserRoundCheck, UserRoundX } from "lucide-react";

export default function FriendRequestBlock({}) {
  return (
    <div className="w-full bg-surface p-4 flex flex-col gap-4 rounded-md">
      <h2 className="text-md text-center">
        <span className="text-brand capitalize font-bold">eddie </span>
        wants to be your friend
      </h2>
      <MatchAvatars size={80} />
      <div className="flex gap-4">
        <Button icon={<UserRoundX size={20} />} className="" variant="outline">
          Reject
        </Button>
        <Button icon={<UserRoundCheck size={20} />} className="w-full">
          Accept
        </Button>
      </div>
    </div>
  );
}
