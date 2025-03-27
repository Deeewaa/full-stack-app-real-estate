import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties" },
    { href: "/agents", label: "Agents" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="font-display text-2xl font-bold text-primary cursor-pointer">
                Realty Estate
              </a>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-all ${
                      location === link.href
                        ? "border-primary text-primary"
                        : "border-transparent text-neutral-700 hover:text-secondary hover:border-secondary"
                    }`}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center">
            <Button>Sign In</Button>
          </div>

          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-neutral-700">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="mb-4">
                  <SheetTitle className="font-display text-primary">Realty Estate</SheetTitle>
                  <SheetDescription>Find your dream property in Zambia</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-3 mt-6">
                  {navLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link href={link.href}>
                        <a
                          className={`px-4 py-2 rounded-md text-base font-medium ${
                            location === link.href
                              ? "bg-primary-light text-white"
                              : "text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                          }`}
                        >
                          {link.label}
                        </a>
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="pt-4 border-t border-neutral-200 mt-4">
                    <SheetClose asChild>
                      <Button className="w-full">Sign In</Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
