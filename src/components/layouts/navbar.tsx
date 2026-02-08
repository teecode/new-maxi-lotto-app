import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { makeFirstLetterUppercase } from '@/lib/utils'
import { logout } from '@/services/AuthService'
import useAuthStore from '@/store/authStore'
import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Lock, LogOut, User } from 'lucide-react'
import { useEffect } from 'react'
import MobileNav from './mobile-nav-drawer';

const menu = [
  {
    title: "Home",
    url: "/"
  },
  {
    title: "About Us",
    url: "/about"
  },
  {
    title: "Play Now",
    url: "/play"
  },
  {
    title: "Games",
    url: "/games"
  },
  {
    title: "Accumulator",
    url: "/accumulator"
  },
  {
    title: "How To Play",
    url: "/how-to-play"
  },
  {
    title: "Results",
    url: "/results"
  },
  {
    title: "Faq",
    url: "/faq"
  },
  {
    title: "contact Us",
    url: "/contact"
  }
];

const Navbar = () => {

  const { isAuthenticated, minimalUser: user, syncUser } = useAuthStore();

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
    <header>

      <nav
        className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-20 bg-white text-gray-700 shadow-[0px_4px_25px_0px_#0000000D] transition-all">
        <div className="flex items-center space-x-3">
          {/* Hamburger Icon (Mobile) */}
          <div className="md:hidden">
            <MobileNav menu={menu} />
          </div>
          <Link to="/" className="flex items-center">
            <Image src="/maxilotto.png" alt="MaxiLotto Logo"
              className="aspect-auto object-contain" width={125} height={25} />
          </Link>
        </div>

        <ul className="md:flex hidden items-center gap-10">
          {menu.map(({ title, url }, index) => (
            <li key={index}>
              <Link to={url} className="font-normal hover:text-primary-600">{title}</Link>
            </li>
          ))}
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
                          className="border-2 border-background hover:z-10" />
                        <AvatarFallback>{makeFirstLetterUppercase(user?.username)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="text-xs text-muted-foreground me-1.5">
                      <span
                        className="font-semibold text-foreground">NGN {user?.walletBalance ?? 0}</span>
                    </p>
                    {/* {isFetching && (
                      <Spinner className="size-4 absolute right-1 -top-2 text-primary-900" />
                    )} */}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 font-poppins" align="end" forceMount>
                  {/* Account Section */}
                  <DropdownMenuLabel className="font-medium">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings/change-password">
                        <Lock />
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>


            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild
                className="bg-tertiary-900 px-6 h-8 rounded-full text-background hover:bg-primary-600">
                <Link to="/auth/signup">Register</Link>
              </Button>
              <Button asChild variant={"ghost"}
                className="text-foreground hover:bg-primary-950 px-2 h-8 hover:text-primary-600">
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