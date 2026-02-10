import { useState, useEffect } from "react";
import { ChevronRight, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Link, useLocation } from "@tanstack/react-router";
import { Image } from "@unpic/react";

interface MobileNavProps {
  menu: { title: string; url: string }[];
}

const MobileNav = ({ menu }: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  // 👇 Automatically close sheet when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="!size-9 text-tertiary-900" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="p-4" side="left">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>
        <div className="flex items-center justify-between">
          <Link to="/app">
            <Image
              src="/logo.png"
              alt="MaxiLotto Logo"
              width={105}
              height={32}
            />
          </Link>
        </div>

        {menu.length > 0 && (
          <div className="mt-8 grid gap-2">
            {menu.map(({ title, url }, index) => (
              <Link
                key={index}
                to={url}
                onClick={() => setOpen(false)} // 👈 close sheet manually when clicked
                className="py-2 text-sm text-foreground rounded flex items-center hover:bg-gray-200 hover:text-ocean-600 font-medium"
              >
                <ChevronRight className="!size-4 inline-block me-2" />
                {title}
              </Link>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
