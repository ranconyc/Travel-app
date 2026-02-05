import PageInfo from "@/components/molecules/PageInfo";
import HeroImage from "@/components/molecules/HeroImage";
import SocialLinks from "@/components/molecules/SocialLinks";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  heroImageSrc?: string | null;
  socialQuery: string;
  type?: "country" | "city" | "place";
  badge?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  heroImageSrc,
  socialQuery,
  type = "place",
  badge,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-8 mt-8 md:mt-12">
      {/* Page Info */}
      <PageInfo title={title} subtitle={subtitle} />

      {/* Optional Badge (Match Score, Location Indicator, etc) */}
      {badge}

      {/* Hero Image */}
      <HeroImage src={heroImageSrc} name={title} />

      {/* Social Links */}
      <SocialLinks query={socialQuery} type={type} />
    </div>
  );
}
