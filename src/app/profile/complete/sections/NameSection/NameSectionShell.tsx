import FirstNameSectionClient from "./FirstNameSectionClient";
import LastNameSectionClient from "./LastNameSectionClient";

export default function NameSectionShell() {
  return (
    <div className="w-full flex gap-2">
      <FirstNameSectionClient />
      <LastNameSectionClient />
    </div>
  );
}
