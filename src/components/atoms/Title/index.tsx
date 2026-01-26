import { cn } from "@/lib/utils";

interface TitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
}

export default function Title({
  children,
  icon,
  as: Component = "h1",
  className,
}: TitleProps) {
  const title = (
    <Component className={cn("text-p font-bold w-fit capitalize", className)}>
      {children}
    </Component>
  );

  return icon ? (
    <div className="flex items-center gap-2 mb-2">
      {icon}
      {title}
    </div>
  ) : (
    title
  );
}
