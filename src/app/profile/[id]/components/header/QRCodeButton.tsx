"use client";

import Button from "@/app/components/common/Button";
import { QrCode } from "lucide-react";
import { memo, useCallback } from "react";
import { useProfileActions } from "../../store/useProfileStore";

function QRCodeButton() {
  const { setQRCodeModalOpen } = useProfileActions();

  const handleClick = useCallback(() => {
    setQRCodeModalOpen(true);
  }, [setQRCodeModalOpen]);

  return (
    <Button
      size="sm"
      variant="icon"
      onClick={handleClick}
      icon={<QrCode size={20} />}
      aria-label="Show QR code"
    />
  );
}

export default memo(QRCodeButton);
