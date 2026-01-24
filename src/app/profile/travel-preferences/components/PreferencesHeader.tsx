import Logo from "@/components/atoms/Logo";

type PreferencesHeaderProps = {
  selectedCount: number;
};

export default function PreferencesHeader({
  selectedCount,
}: PreferencesHeaderProps) {
  return (
    <header className="bg-black text-white px-4 pt-4 pb-6">
      <Logo />

      <div className="mt-6">
        <p className="text-sm">Tell us more about your</p>
        <h1 className="text-3xl font-semibold leading-tight">
          Travel preferences
        </h1>
        {selectedCount > 0 && (
          <p className="mt-2 text-xs text-gray-300">
            {selectedCount} preferences selected
          </p>
        )}
      </div>
    </header>
  );
}
