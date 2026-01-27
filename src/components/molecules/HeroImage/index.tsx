import Image from "next/image";

export default function HeroImage({
  src,
  name,
}: {
  src?: string | null;
  name: string;
}) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl animate-scale-in">
      {src ? (
        <div className="relative w-full h-full group">
          <Image 
            src={src} 
            alt={name} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
            priority 
          />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>
      ) : (
        <div className="w-full h-full relative group">
          <Image
            src={`https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop&sig=${name}`}
            alt={`${name} placeholder`}
            fill
            className="object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-100"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/30 to-black/50">
            <div className="text-center">
              <span className="text-6xl font-bold text-white drop-shadow-2xl mb-2">
                {name.substring(0, 2).toUpperCase()}
              </span>
              <span className="text-sm text-white/80 font-medium">
                {name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute top-4 right-4">
        <div className="w-2 h-2 bg-brand/50 rounded-full animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="w-2 h-2 bg-brand-alt/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}
