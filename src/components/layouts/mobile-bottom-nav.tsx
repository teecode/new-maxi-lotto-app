import { cn } from "@/lib/utils";
import {
  ChartBar,
  CreditCard,
  HousePlusIcon,
  UserCircle,
  LogIn,
  PlayIcon
} from "lucide-react";
import { useInstantAuth } from "@/hooks/useInstantAuth";
import { Link, useLocation } from "@tanstack/react-router";

const MobileBottomNav = () => {

  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  const authenticated = useInstantAuth();

  const bottomNavLinks = [
    { label: "Home", route: "/", icon: HousePlusIcon },
    { label: "Results", route: "/results", icon: ChartBar },
    { label: "Play", route: "/play", icon: PlayIcon },
    { label: "Accumulator", route: "/accumulator", icon: ChartBar }, // Using ChartBar as placeholder or import Layers
    { label: "Deposit", route: "/deposit", icon: CreditCard },
    authenticated
      ? { label: "Profile", route: "/profile", icon: UserCircle }
      : { label: "Login", route: "/auth/login", icon: LogIn },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex bg-[#FFF100] md:hidden z-50">
      {bottomNavLinks.map((link) => {
        const isActive =
          (pathname.includes(link.route) && link.route.length > 1) ||
          pathname === link.route;

        return (
          <Link
            to={link.route}
            key={link.label}
            className={cn(
              "flex-1 flex flex-col text-sm font-poppins items-center justify-center text-gray-950 py-2 hover:text-primary",
              isActive && "text-white bg-pink-600"
            )}
          >
            <link.icon
              size={28}
              className="transition-colors duration-200"
              color={isActive ? "white" : "#0A4B7F"}
            />
            <p className="mt-1">{link.label}</p>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
