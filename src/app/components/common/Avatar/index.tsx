import Image from "next/image";

type AvatarProps = {
  image?: string;
  name?: string;
  size?: number; // size in pixels
  className?: string;
  style?: React.CSSProperties;
};

// cleaner, more flexible avatar component
export function Avatar({
  image,
  name = "",
  size = 40, // default size
  className = "",
  style,
  ...props
}: AvatarProps) {
  return (
    <div
      // inline size keeps flexibility (Tailwind can't generate dynamic px classes)
      style={{ width: size, height: size, ...style }}
      className={`relative inline-block rounded-full overflow-hidden bg-white ${className}`}
      {...props}
    >
      <Image
        // if no image was provided, use fallback
        src={
          image ||
          "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
        }
        alt={`${name} profile`}
        fill
        className="object-cover"
        sizes={`${size}px`} // tell Next.js the real rendered size
      />
    </div>
  );
}
