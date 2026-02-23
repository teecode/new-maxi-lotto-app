import {useEffect, useState} from "react";
import {ChevronDown, ChevronRight, Menu} from "lucide-react";
import {Button} from "../ui/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "../ui/sheet";
import {Link, useLocation} from "@tanstack/react-router";
import {Image} from "@unpic/react";
import type {navGroupProps} from "@/types";

interface MobileNavProps {
  navGroups: Array<navGroupProps>;
}

const MobileNav = ({navGroups}: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="!size-9 text-tertiary-900"/>
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="p-4" side="left">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>

        <div className="flex items-center justify-between mb-6">
          <Link to="/app">
            <Image
              src="/logo.png"
              alt="MaxiLotto Logo"
              width={105}
              height={32}
            />
          </Link>
        </div>

        <ul className="flex flex-col">
          {navGroups.map((group) =>
            group.single ? (
              <li key={group.title} className="border-b border-border last:border-none">
                <Link
                  to={group.url}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-3 px-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <ChevronRight className="size-4 shrink-0 opacity-50"/>
                  {group.title}
                </Link>
              </li>
            ) : (
              <li key={group.title} className="border-b border-border last:border-none">
                {/* Accordion trigger */}
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="flex w-full items-center justify-between py-3 px-1 text-sm font-medium text-foreground hover:text-primary transition-colors outline-none"
                >
                  <span className="flex items-center gap-2">
                    <ChevronRight className="size-4 shrink-0 opacity-50"/>
                    <span>{group.title}</span>
                  </span>

                  <ChevronDown
                    className={`size-4 shrink-0 opacity-60 transition-transform duration-200 ${
                      expandedGroups[group.title] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Sliding children */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedGroups[group.title]
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="flex flex-col pb-2 pl-4 border-l-2 border-primary/30 ml-1">
                    {group.children?.map(({title, url}) => (
                      <li key={url}>
                        <Link
                          to={url}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 py-2 px-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
                        >
                          <ChevronRight className="size-3 shrink-0 opacity-50"/>
                          {title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          )}
        </ul>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;