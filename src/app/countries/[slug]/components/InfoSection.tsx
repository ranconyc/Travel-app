import { Country } from "@/domain/country/country.schema";

export default function InfoSection({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">
        {subtitle}
      </p>
      <h1 className="text-3xl font-bold mt-1 flex items-center justify-center gap-2">
        {title}
      </h1>
    </div>
  );
}
