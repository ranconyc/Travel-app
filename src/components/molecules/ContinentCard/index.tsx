import Link from "next/link";
import { Globe } from "lucide-react";

import Typography from "@/components/atoms/Typography";

interface ContinentCardProps {
  continent: {
    name: string;
    slug: string;
    color: string;
    icon: string;
  };
}

export default function ContinentCard({ continent }: ContinentCardProps) {
  return (
    <Link
      href={`/continents/${continent.slug}`}
      className="group relative h-40 rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-all block"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${continent.color} opacity-90 group-hover:opacity-100 transition-opacity duration-500`}
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="absolute inset-0 flex items-center justify-between p-8">
        <div>
          <Typography
            variant="h2"
            weight="bold"
            color="inverse"
            className="text-3xl drop-shadow-md"
          >
            {continent.name}
          </Typography>
          <Typography
            variant="body"
            weight="medium"
            color="inverse"
            className="opacity-80 mt-1 flex items-center gap-1"
          >
            Explore region <Globe className="w-4 h-4 opacity-70" />
          </Typography>
        </div>
        <Typography
          variant="micro"
          as="span"
          className="text-6xl filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300"
        >
          {continent.icon}
        </Typography>
      </div>

      <div className="absolute inset-0 bg-line-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    </Link>
  );
}
