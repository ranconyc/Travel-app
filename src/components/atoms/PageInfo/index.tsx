import Typography from "@/components/atoms/Typography";

interface PageInfoProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function PageInfo({ title, subtitle, className = "" }: PageInfoProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {subtitle && (
        <Typography variant="h3" className="text-brand font-medium text-sm uppercase tracking-wider animate-fade-in">
          {subtitle}
        </Typography>
      )}
      <Typography variant="h1" className="text-txt-main font-bold text-4xl md:text-5xl leading-tight animate-slide-up">
        {title}
      </Typography>
    </div>
  );
}
