import FirstNameSectionClient from "@/app/(public)/profile/edit/sections/NameSection/FirstNameSectionClient";
import LastNameSectionClient from "@/app/(public)/profile/edit/sections/NameSection/LastNameSectionClient";

export default function NameSectionShell() {
  return (
    <div className="flex gap-sm">
      <div className="flex-1">
        <FirstNameSectionClient />
      </div>
      <div className="flex-1">
        <LastNameSectionClient />
      </div>
    </div>
  );
}
