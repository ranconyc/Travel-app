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
      <h2 className="text-gray-400 text-sm uppercase tracking-wider font-medium">
        {subtitle}
      </h2>
      <h1 className="text-3xl font-bold mt-1 flex items-center justify-center gap-2">
        {title}
      </h1>
    </div>
  );
}
