"use client";

import Modal from "@/app/components/common/Modal";
import {
  useIsProfileModalOpen,
  useLoggedUser,
  useProfileActions,
  useProfileUser,
} from "../../store/useProfileStore";
import MatchSummary from "../compatibility/MatchSummary";
import MatchBreakdown from "../compatibility/MatchBreakdown";
import MatchAvatars from "../compatibility/MatchAvatars";

export default function ProfileModal() {
  const { setProfileModalOpen } = useProfileActions();
  const isOpen = useIsProfileModalOpen();
  const profileUser = useProfileUser();
  const loggedUser = useLoggedUser();

  if (!profileUser || !loggedUser) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setProfileModalOpen(false)}
      title=""
      variant="popup"
    >
      <div className="py-4">
        <MatchAvatars />
        <MatchSummary />
        <MatchBreakdown />
      </div>
    </Modal>
  );
}
