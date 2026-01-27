import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Typography from "@/components/atoms/Typography";

interface FloatingCardListProps {
  title: string;
  description?: string;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    image?: string;
    href: string;
    icon?: React.ReactNode;
    badge?: string;
  }>;
  showViewAll?: boolean;
  viewAllHref?: string;
  className?: string;
}

export default function FloatingCardList({
  title,
  description,
  items,
  showViewAll = false,
  viewAllHref,
  className = "",
}: FloatingCardListProps) {
  return (
    <section className={`flex flex-col gap-8 animate-fade-in ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-txt-main tracking-tight">
            {title}
          </Typography>
          {description && (
            <Typography variant="p" className="text-secondary text-balance">
              {description}
            </Typography>
          )}
        </div>
        {showViewAll && viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-brand text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all duration-200 hover:text-brand/90"
          >
            View all <ChevronRight size={16} className="animate-pulse" />
          </Link>
        )}
      </div>

      {/* Floating Cards */}
      <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar snap-x snap-mandatory">
        {items.length > 0 ? (
          items.map((item, index) => (
            <Link
              href={item.href}
              key={item.id}
              className="snap-start min-w-[180px] w-[180px] flex-shrink-0 relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-secondary group shadow-lg hover:shadow-xl transition-all duration-500 border border-surface-secondary/50 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Image */}
              {item.image ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface to-surface-secondary flex items-center justify-center">
                  {item.icon || <div className="w-8 h-8 rounded-full bg-surface-tertiary flex items-center justify-center text-secondary/40" />}
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-4">
                <div className="flex flex-col gap-2 transform transition-transform duration-500 group-hover:-translate-y-1">
                  <span className="font-bold text-white text-sm leading-tight line-clamp-2">
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="text-xs text-white/80 line-clamp-1">
                      {item.subtitle}
                    </span>
                  )}
                  {item.badge && (
                    <span className="text-xs uppercase tracking-wider text-brand font-bold bg-brand/20 px-2 py-1 rounded-full inline-block">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand to-brand-alt transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full" />
            </Link>
          ))
        ) : (
          <div className="p-12 text-center bg-surface/30 rounded-3xl border-2 border-dashed border-surface-secondary/50 backdrop-blur-sm">
            <div className="bg-surface-secondary/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 rounded-full bg-surface-tertiary flex items-center justify-center text-secondary/40" />
            </div>
            <Typography variant="h4" className="text-secondary font-medium mb-2">
              No items found
            </Typography>
            <Typography variant="p" className="text-secondary/60 text-sm max-w-[250px] mx-auto text-balance">
              Check back soon for more content
            </Typography>
          </div>
        )}
      </div>
    </section>
  );
}
