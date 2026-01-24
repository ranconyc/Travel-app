import FirstNameSectionClient from "@/app/profile/edit/sections/NameSection/FirstNameSectionClient";
import LastNameSectionClient from "@/app/profile/edit/sections/NameSection/LastNameSectionClient";

export default function NameSectionShell() {
  return (
    <div className="flex flex-col sm:flex-row gap-md">
      <div className="flex-1">
        <FirstNameSectionClient />
      </div>
      <div className="flex-1">
        <LastNameSectionClient />
      </div>
    </div>
  );
}
