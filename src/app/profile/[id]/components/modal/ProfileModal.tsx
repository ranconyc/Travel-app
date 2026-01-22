"use client";

import Modal from "@/app/components/common/Modal";
import {
  useIsProfileModalOpen,
  useLoggedUser,
  useProfileActions,
  useProfileUser,
} from "../../store/useProfileStore";
import { calculateMatchScoreBatch } from "@/domain/match/match.queries";
import MatchSummary from "../compatibility/MatchSummary";
import MatchBreakdown from "../compatibility/MatchBreakdown";
import MatchAvatar from "../compatibility/MatchAvatar";

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
