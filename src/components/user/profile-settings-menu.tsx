import { ProfileSettingsTwo } from "@/constants";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

const ProfileSettingsMenu = () => {

  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {ProfileSettingsTwo.map((link) => {
        const isActive = pathname.startsWith(link.route);
        return (
          <Link
            key={link.label}
            to={link.route}
            className={cn(
              "group relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 border-2",
              isActive 
                ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-950/10" 
                : "bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
            )}
          >
            <div className={cn(
              "mb-3 p-3 rounded-2xl transition-colors duration-300",
              isActive ? "bg-slate-800" : "bg-slate-50 group-hover:bg-slate-100"
            )}>
              <link.icon size={24} className={isActive ? "text-white" : "text-slate-500"} />
            </div>
            
            <span className="text-sm font-bold tracking-tight uppercase">
              {link.label}
            </span>

            {/* Subtle Arrow for Hover State */}
            {!isActive && (
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

export default ProfileSettingsMenu;
