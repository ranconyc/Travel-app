import FirstNameSectionClient from "./FirstNameSectionClient";
import LastNameSectionClient from "./LastNameSectionClient";

export default function NameSectionShell() {
  return (
    <div className="w-full flex gap-2">
      <div className="flex-1">
        <FirstNameSectionClient />
      </div>
      <div className="flex-1">
        <LastNameSectionClient />
      </div>
    </div>
  );
}
