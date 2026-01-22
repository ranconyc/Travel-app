import Image from "next/image";

export default function HeroImage({
  src,
  name,
}: {
  src?: string | null;
  name: string;
}) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
      {src ? (
        <div className="relative w-full h-full">
          <Image src={src} alt={name} fill className="object-cover" priority />
          {/* Gradient Overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" /> */}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-surface text-secondary">
          <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-400 to-gray-600">
            {name.substring(0, 2).toUpperCase()}
          </span>
        </div>
      )}

      {/* Country Badge */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        {/* Sparkle decoration */}
      </div>
    </div>
  );
}
