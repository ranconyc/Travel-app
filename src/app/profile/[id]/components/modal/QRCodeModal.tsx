"use client";

import { QRCodeSVG } from "qrcode.react";
import Modal from "@/app/components/common/Modal";
import {
  useIsQRCodeModalOpen,
  useProfileActions,
  useProfileUser,
} from "../../store/useProfileStore";
import { useEffect, useState } from "react";

export default function QRCodeModal() {
  const { setQRCodeModalOpen } = useProfileActions();
  const isOpen = useIsQRCodeModalOpen();
  const profileUser = useProfileUser();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!profileUser) return null;

  const profileUrl = isHydrated
    ? `${window.location.origin}/profile/${profileUser.id}`
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setQRCodeModalOpen(false)}
      title="Share Profile"
      variant="popup"
    >
      <div className="py-8 flex flex-col items-center gap-6">
        <div className="bg-white p-4 rounded-xl shadow-lg">
          {profileUrl && (
            <QRCodeSVG
              value={profileUrl}
              size={200}
              level="H"
              includeMargin={false}
              imageSettings={{
                src:
                  profileUser.avatarUrl ||
                  "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          )}
        </div>

        <div className="text-center space-y-1">
          <p className="font-semibold text-lg">{profileUser.name}</p>
          <p className="text-secondary text-sm">Scan to view my profile</p>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(profileUrl);
            alert("Profile link copied to clipboard!");
          }}
          className="text-brand text-sm font-medium hover:underline px-4 py-2 rounded-lg bg-brand/10"
        >
          Copy Profile Link
        </button>
      </div>
    </Modal>
  );
}
