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
        </div>
      ) : (
        <div className="w-full h-full relative">
          <Image
            src={`https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop&sig=${name}`}
            alt={`${name} placeholder`}
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="text-6xl font-bold text-white drop-shadow-lg">
              {name.substring(0, 2).toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Country Badge */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        {/* Sparkle decoration */}
      </div>
    </div>
  );
}
