import Typography from "@/components/atoms/Typography";

interface PageInfoProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function PageInfo({
  title,
  subtitle,
  className = "",
}: PageInfoProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {subtitle && (
        <Typography
          variant="label"
          weight="medium"
          color="brand"
          className="text-sm animate-fade-in"
        >
          {subtitle}
        </Typography>
      )}
      <Typography
        variant="display-md"
        weight="bold"
        color="main"
        className="animate-slide-up"
      >
        {title}
      </Typography>
    </div>
  );
}
