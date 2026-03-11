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
import {makeFirstLetterUppercase} from '@/lib/utils'
import {logout} from '@/services/AuthService'
import useAuthStore from '@/store/authStore'
import {Link} from '@tanstack/react-router';
import {Image} from '@unpic/react';
import {ChevronDown, Lock, LogOut, User} from 'lucide-react'
import {useEffect} from 'react'
import MobileNav from './mobile-nav-drawer';
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
    ],
  },
  {
    title: "Support",
    single: false,
    children: [
      {title: "FAQ", url: "/faq"},
      {title: "Contact Us", url: "/contact"},
    ],
  },
];

const Navbar = () => {

  const {isAuthenticated, minimalUser: user, syncUser} = useAuthStore();

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
    <header className="absolute w-full">

      <nav
        className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-20  text-gray-700 shadow-[0px_4px_25px_0px_#0000000D] transition-all">
        <div className="flex items-center space-x-3">
          {/* Hamburger Icon (Mobile) */}
          <div className="md:hidden">
            <MobileNav navGroups={navGroups}/>
          </div>
          <Link to="/" className="flex items-center">
            <Image src="/maxilotto.png" alt="Maxi Lotto" width={126} height={26} className="h-6 sm:h-7 w-auto object-contain brightness-0 invert drop-shadow-md" />
          </Link>
        </div>

        <ul className="hidden md:flex items-center gap-1">
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className="flex items-center relative rounded-full p-0.5 gap-1.5 border border-border shadow-sm shadow-black/5">
                    <div className="flex -space-x-1">
                      <Avatar className="size-7">
                        <AvatarImage src="/avatars.png" alt="@reui"
                                     className="border-2 border-background hover:z-10"/>
                        <AvatarFallback>{makeFirstLetterUppercase(user?.username)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="text-xs text-muted-foreground me-1.5">
                      <span
                        className="font-semibold text-background">NGN {user?.walletBalance ?? 0}</span>
                    </p>
                    {/* {isFetching && (
                      <Spinner className="size-4 absolute right-1 -top-2 text-primary-900" />
                    )} */}
                  </div>
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
                      className="bg-tertiary-900 px-6 h-8 text-sm uppercase font-semibold  rounded-full text-background hover:bg-primary-600">
                <Link to="/auth/signup">Register</Link>
              </Button>
              <Button asChild variant={"ghost"}
                      className="text-white hover:bg-primary-950 px-2 h-8 text-sm uppercase font-semibold hover:text-primary-600">
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