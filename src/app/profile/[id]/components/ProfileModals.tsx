"use client";

import Modal from "@/app/components/common/Modal";
import {
  useIsInterestsModalOpen,
  useLoggedUser,
  useProfileActions,
  useProfileUser,
} from "../store/useProfileStore";
import { calculateMatchScoreBatch } from "@/domain/match/match.queries";

export function ProfileModals() {
  const isInterestsOpen = useIsInterestsModalOpen();
  const { setInterestsModalOpen } = useProfileActions();
  const profileUser = useProfileUser();
  const loggedUser = useLoggedUser();

  if (!profileUser) return null;

  const compatibilityScore = loggedUser
    ? calculateMatchScoreBatch(loggedUser, profileUser, "current").score
    : 0;

  return (
    <>
      <Modal
        isOpen={isInterestsOpen}
        onClose={() => setInterestsModalOpen(false)}
        title=""
      >
        <div className="h-300">
          <h1 className="header-1">Competability</h1>
          <p className="subheader">{`You and ${profileUser.name} are ${Math.round(
            compatibilityScore,
          )}% compatible.`}</p>
        </div>
      </Modal>
    </>
  );
}
