"use client";

import Modal from "@/app/components/common/Modal";
import {
  useIsInterestsModalOpen,
  useIsProfileModalOpen,
  useLoggedUser,
  useProfileActions,
  useProfileUser,
} from "../../store/useProfileStore";
import { calculateMatchScoreBatch } from "@/domain/match/match.queries";
import { Avatar } from "@/app/components/common/Avatar";
import { MatchResult } from "@/domain/match/match.schema";
import MatchSummary from "./MatchSummary";
import MatchBreakdown from "./MatchBreakdown";
import MatchAvatar from "./MatchAvatar";

export default function ProfileModal() {
  const { setProfileModalOpen } = useProfileActions();
  const isOpen = useIsProfileModalOpen();
  const profileUser = useProfileUser();
  const loggedUser = useLoggedUser();

  if (!profileUser || !loggedUser) return null;

  const matchResult = calculateMatchScoreBatch(
    loggedUser,
    profileUser,
    "current",
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setProfileModalOpen(false)}
      title=""
      variant="popup"
    >
      <div className="py-4">
        <MatchAvatar matchResult={matchResult} />
        <MatchSummary />
        <MatchBreakdown matchResult={matchResult} />
      </div>
    </Modal>
  );
}
