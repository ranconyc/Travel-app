"use client";

import Button from "@/components/atoms/Button";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";

function ProfileSettingsButton() {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push("/profile/settings");
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
