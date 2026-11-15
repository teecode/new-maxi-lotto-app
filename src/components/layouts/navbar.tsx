import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {cn, formatCurrency, makeFirstLetterUppercase} from '@/lib/utils'
import {logout} from '@/services/AuthService'
import useAuthStore from '@/store/authStore'
import {Link} from '@tanstack/react-router';
import {Image} from '@unpic/react';
import {ChevronDown, Gift, Lock, LogOut, Plus, User, Users} from 'lucide-react'
import {useEffect, useState} from 'react'
import MobileNav from './mobile-nav-drawer';
import NotificationBell from '@/components/notification-bell';
import type {navGroupProps} from "@/types";

const navGroups: Array<navGroupProps> = [
  {
    title: "Play 5/90",
    url: "/play",
    single: true,
  },
  {
    title: "Maxi Special Combo",
    url: "/accumulator",
    single: true,
  },
  {
    title: "My Bets",
    url: "/tickets",
    single: true,
  },
  {
    title: "Game Center",
    single: false,
    children: [
      {title: "Maxi Games", url: "/games"},
      {title: "Maxi Results", url: "/results"},
      {title: "Leaderboard", url: "/leaderboard"},
      {title: "Promotions", url: "/promotions"},
    ],
  },
  {
    title: "Support",
    single: false,
    children: [
      {title: "Maxi Ask", url: "/faq"},
      {title: "Maxi Drive", url: "/how-to-play"},
      {title: "Lotto Guide", url: "/lotto-in-nigeria"},
      {title: "Become an Agent", url: "/become-an-agent"},
      {title: "Get the App", url: "/download-app"},
      {title: "Contact Us", url: "/contact"},
    ],
  },
];

const Navbar = () => {

  const {isAuthenticated, minimalUser: user, syncUser} = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch the latest profile when authenticated or on mount
      syncUser();
    }
  }, [isAuthenticated, syncUser]);
  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log("Logout response:", response);
      // Toast.success("Logged out successfully");
      useAuthStore.getState().clearToken();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-[#091527]/92 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-gradient-to-b from-[#091527]/65 to-transparent"
      )}
    >

      <nav
        className="h-[70px] relative w-full px-4 md:px-8 lg:px-16 flex items-center justify-between z-20 text-gray-700 transition-all">
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Hamburger Icon (Mobile) */}
          <div className="lg:hidden">
            <MobileNav navGroups={navGroups}/>
          </div>
          <Link to="/" className="flex items-center gap-1 sm:gap-2 group">
            <div className="relative">
              <Image priority src="/maxilotto-icon.png" alt="MaxiLotto Icon" width={40} height={40} className="h-9 sm:h-10 w-auto object-contain brightness-0 invert drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-pink-500/20 blur-lg rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {/* Mobile/Tablet: MaxiLotto text */}
            <span className="text-base sm:text-lg font-black text-white tracking-tighter lg:hidden drop-shadow-md whitespace-nowrap">
              MaxiLotto
            </span>
            {/* Desktop: MaxiLotto Image */}
            <Image src="/maxilotto.png" alt="Maxi Lotto" width={126} height={26} className="hidden lg:block h-6 sm:h-7 w-auto object-contain brightness-0 invert drop-shadow-md" />
          </Link>
        </div>

        <ul className="hidden lg:flex items-center gap-1">
          {navGroups.map((group) =>
            group.single ? (
              <li key={group.title}>
                <Link
                  to={group.url}
                  className="px-3 py-2 font-semibold tracking-[-2%] text-sm uppercase text-white hover:text-accent-1-500 transition-colors"
                >
                  {group.title}
                </Link>
              </li>
            ) : (
              <li key={group.title}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center text-white gap-1 px-3 py-2 text-sm uppercase font-semibold tracking-[-2%] hover:text-accent-1-500 transition-colors outline-none">
                      {group.title}
                      <ChevronDown className="h-4 w-4 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-44">
                    <DropdownMenuGroup>
                      {group.children && group.children.map(({ title, url }) => (
                        <DropdownMenuItem key={url} asChild>
                          <Link to={url} className="w-full cursor-pointer py-2 text-xs uppercase font-semibold ">
                            {title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            )
          )}
        </ul>

        <div className="flex items-center space-x-1">
          {/* register and login button */}
          {isAuthenticated ? (
            <>
              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex h-8 rounded-full bg-[#FFF100] hover:bg-[#ffe84a] text-[#0A4B7F] font-bold text-xs px-3.5 shadow-sm"
              >
                <Link to="/deposit" className="flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  Deposit
                </Link>
              </Button>

              <NotificationBell/>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center relative rounded-full p-0.5 pr-2.5 gap-1.5 border border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur-sm shadow-sm transition-colors cursor-pointer"
                  >
                    <div className="flex -space-x-1">
                      <Avatar className="size-7">
                        <AvatarImage src="/avatars.png" alt="@reui"
                                     className="border-2 border-background hover:z-10"/>
                        <AvatarFallback>{makeFirstLetterUppercase(user?.username)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-xs font-semibold text-white tabular-nums">
                      {formatCurrency(user?.walletBalance ?? 0)}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 font-poppins" align="end" forceMount>
                  {/* Account Section */}
                  <DropdownMenuLabel className="font-medium">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User/>
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild>
                      <Link to="/bonuses">
                        <Gift/>
                        <span>My Bonuses</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild>
                      <Link to="/referrals">
                        <Users/>
                        <span>Referrals</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild>
                      <Link to="/settings/change-password">
                        <Lock/>
                        <span>Change Password</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  {/* <DropdownMenuGroup>
                   <DropdownMenuSub>
                   <DropdownMenuSubTrigger>
                   <Settings />
                   <span>Settings</span>
                   </DropdownMenuSubTrigger>
                   <DropdownMenuPortal>
                   <DropdownMenuSubContent>
                   <DropdownMenuItem asChild>
                   <Link href="/settings/profile">
                   <RiUserSettingsFill />
                   <span>Profile</span>
                   </Link>
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem asChild>
                   <Link href="/settings/change-password">
                   <Lock />
                   <span>Change Password</span>
                   </Link>
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem asChild>
                   <Link href="/settings/bank">
                   <Building />
                   <span>Bank Details</span>
                   </Link>
                   </DropdownMenuItem>
                   </DropdownMenuSubContent>
                   </DropdownMenuPortal>
                   </DropdownMenuSub>
                   </DropdownMenuGroup> */}
                  {/* Logout */}
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut/>
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>


            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild
                      className="bg-tertiary-900 px-3 sm:px-6 h-8 text-xs sm:text-sm uppercase font-semibold rounded-full text-background hover:bg-primary-600">
                <Link to="/auth/signup">Register</Link>
              </Button>
              <Button asChild variant={"ghost"}
                      className="text-white hover:bg-primary-950 px-1 sm:px-2 h-8 text-xs sm:text-sm uppercase font-semibold hover:text-primary-600">
                <Link to="/auth/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

    </header>
  )
}

export default Navbar