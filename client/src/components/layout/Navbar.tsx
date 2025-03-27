import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User, LogOut, Home, Building, UserPlus, Mail, Heart } from "lucide-react";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

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
    { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/properties", label: "Properties", icon: <Building className="h-4 w-4 mr-2" /> },
    { href: "/agents", label: "Agents", icon: <UserPlus className="h-4 w-4 mr-2" /> },
    { href: "/contact", label: "Contact", icon: <Mail className="h-4 w-4 mr-2" /> },
  ];

  const handleLogout = () => {
    logout();
    setLocation("/auth/login");
  };

  // Generate user initials for avatar
  const getUserInitials = () => {
    if (!user) return "?";
    
    if (user.fullName) {
      return user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isAuthenticated ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/">
              <div className="font-display text-2xl font-bold text-primary cursor-pointer">
                Realty Estate
              </div>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-all ${
                      location === link.href
                        ? "border-primary text-primary"
                        : "border-transparent text-neutral-700 hover:text-secondary hover:border-secondary"
                    }`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
              
              {/* Show "Add Property" link only for landlords */}
              {isAuthenticated && user?.userType === "Landlord & Sell" && (
                <Link href="/properties/new">
                  <div
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-all ${
                      location === "/properties/new"
                        ? "border-primary text-primary"
                        : "border-transparent text-neutral-700 hover:text-secondary hover:border-secondary"
                    }`}
                  >
                    Add Property
                  </div>
                </Link>
              )}
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user?.profileImage || ""} alt={user?.username || ""} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user?.fullName || user?.username}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setLocation(`/profile/${user?.id}`)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  {user?.userType === "Landlord & Sell" && (
                    <DropdownMenuItem onSelect={() => setLocation("/properties/new")}>
                      <Building className="mr-2 h-4 w-4" />
                      <span>Add Property</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={() => setLocation(`/profile/${user?.id}`)}>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Saved Properties</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setLocation("/auth/register")}>
                  Register
                </Button>
                <Button onClick={() => setLocation("/auth/login")}>
                  Sign In
                </Button>
              </div>
            )}
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
                
                {isAuthenticated && (
                  <div className="flex items-center space-x-2 py-4">
                    <Avatar>
                      <AvatarImage src={user?.profileImage || ""} alt={user?.username || ""} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.fullName || user?.username}</p>
                      <p className="text-xs text-muted-foreground">{user?.userType}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col space-y-3 mt-2">
                  {navLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link href={link.href}>
                        <div
                          className={`flex items-center px-4 py-2 rounded-md text-base font-medium ${
                            location === link.href
                              ? "bg-primary text-white"
                              : "text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                          }`}
                        >
                          {link.icon}
                          {link.label}
                        </div>
                      </Link>
                    </SheetClose>
                  ))}
                  
                  {isAuthenticated ? (
                    <>
                      <SheetClose asChild>
                        <Link href={`/profile/${user?.id}`}>
                          <div className="flex items-center px-4 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary">
                            <User className="h-4 w-4 mr-2" />
                            My Profile
                          </div>
                        </Link>
                      </SheetClose>
                      
                      {user?.userType === "Landlord & Sell" && (
                        <SheetClose asChild>
                          <Link href="/properties/new">
                            <div className="flex items-center px-4 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary">
                              <Building className="h-4 w-4 mr-2" />
                              Add Property
                            </div>
                          </Link>
                        </SheetClose>
                      )}
                      
                      <SheetClose asChild>
                        <Link href={`/profile/${user?.id}`}>
                          <div className="flex items-center px-4 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary">
                            <Heart className="h-4 w-4 mr-2" />
                            Saved Properties
                          </div>
                        </Link>
                      </SheetClose>
                      
                      <div className="pt-4 border-t border-neutral-200 mt-4">
                        <SheetClose asChild>
                          <Button 
                            variant="destructive" 
                            className="w-full"
                            onClick={handleLogout}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </Button>
                        </SheetClose>
                      </div>
                    </>
                  ) : (
                    <div className="pt-4 border-t border-neutral-200 mt-4 space-y-2">
                      <SheetClose asChild>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setLocation("/auth/register")}
                        >
                          Register
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button 
                          className="w-full"
                          onClick={() => setLocation("/auth/login")}
                        >
                          Sign In
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
