import { Shield, Heart } from "lucide-react";
import Button from "@/app/components/common/Button";

export default function Header() {
  return (
    <nav className="sticky top-0 bg-app-bg fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
      <Button
        variant="back"
        className="bg-gray-800/50 backdrop-blur-md hover:bg-gray-800"
      />
      <div className="flex items-center gap-3">
        {[
          { Icon: Shield, label: "Safety" },
          { Icon: Heart, label: "Favorites" },
        ].map(({ Icon, label }, idx) => (
          <button
            key={idx}
            aria-label={label}
            className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <Icon size={20} className="text-white" />
          </button>
        ))}
      </div>
    </nav>
  );
}
