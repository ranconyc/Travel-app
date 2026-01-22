"use client";

import Button from "@/app/components/common/Button";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";

function ProfileSettingsButton() {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push("/profile/edit");
  }, [router]);

  return (
    <Button
      variant="icon"
      onClick={handleClick}
      icon={<Settings size={20} />}
      aria-label="Edit profile settings"
    />
  );
}

export default memo(ProfileSettingsButton);
