import Link from "next/link";
import { Globe } from "lucide-react";
import Block from "@/components/atoms/Block";
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
      className="group relative h-40 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all block"
    >
      <Block
        className={`absolute inset-0 bg-gradient-to-br ${continent.color} opacity-80 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <Block className="absolute inset-0 flex items-center justify-between p-8">
        <Block>
          <Typography variant="h2" className="text-3xl font-bold text-white font-sora">
            {continent.name}
          </Typography>
          <Typography className="text-white/80 font-medium mt-1 flex items-center gap-1">
            Explore region <Globe className="w-4 h-4 opacity-70" />
          </Typography>
        </Block>
        <Typography variant="span" className="text-6xl filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
          {continent.icon}
        </Typography>
      </Block>

      <Block className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    </Link>
  );
}
