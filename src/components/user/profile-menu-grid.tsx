import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProfileMenuItem {
  label: string;
  route: string;
  icon: LucideIcon;
  badge?: string;
}

interface ProfileMenuGridProps {
  items: ProfileMenuItem[];
}

export function ProfileMenuGrid({ items }: ProfileMenuGridProps) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((link) => {
        const isActive = pathname.startsWith(link.route);
        return (
          <Link
            key={link.label}
            to={link.route}
            className={cn(
              "group relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 border-2",
              isActive
                ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-950/10"
                : "bg-white border-slate-100 text-slate-600 hover:border-[#0185B6]/30 hover:shadow-lg hover:shadow-slate-200/50",
            )}
          >
            {link.badge && (
              <span className="absolute top-3.5 right-3.5 rounded-full bg-[#FFF100] px-2.5 py-0.5 text-[10px] font-black text-[#0A4B7F] shadow-sm">
                {link.badge}
              </span>
            )}

            <div
              className={cn(
                "mb-3 p-3 rounded-2xl transition-colors duration-300",
                isActive ? "bg-slate-800" : "bg-slate-50 group-hover:bg-[#0185B6]/10",
              )}
            >
              <link.icon
                size={24}
                className={isActive ? "text-white" : "text-slate-500 group-hover:text-[#0185B6]"}
              />
            </div>

            <span className="text-sm font-bold tracking-tight uppercase">{link.label}</span>

            {!isActive && (
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

