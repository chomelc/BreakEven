import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Calculator,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Home,
  Menu,
  KeyRound,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { hasValidLicenseKeySync, isPro } from "@/lib/license";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

const Navigation = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isProUser, setIsProUser] = useState(() => hasValidLicenseKeySync());

  useEffect(() => {
    // Validate on mount and update state
    isPro().then(setIsProUser);
    
    // Listen for Pro status changes
    const handleProStatusChange = () => {
      setIsProUser(hasValidLicenseKeySync());
      // Also do async validation to be sure
      isPro().then(setIsProUser);
    };
    
    window.addEventListener('proStatusChanged', handleProStatusChange);
    
    return () => {
      window.removeEventListener('proStatusChanged', handleProStatusChange);
    };
  }, []);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/roi-calculator", label: "ROI", icon: Calculator },
    { path: "/pricing-calculator", label: "Pricing", icon: DollarSign },
    { path: "/churn-calculator", label: "Churn", icon: Users },
    { path: "/mrr-simulator", label: "MRR", icon: TrendingUp },
    { path: "/retention-calculator", label: "Retention", icon: Target },
    { path: "/pro", label: "BreakEven Pro", icon: KeyRound },
  ];

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calculator className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg hidden sm:inline flex items-center gap-2">
              BreakEven
            </span>
            <span>
              {isProUser && (
                <span className="text-[10px] px-1.5 py-0.5 rounded border bg-primary/10 text-primary border-primary/20">
                  Pro
                </span>
              )}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Desktop navigation */}
            <div className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                const isHome = item.path === "/";
                const isProLink = item.path === "/pro";

                return (
                  <Button
                    key={item.path}
                    asChild
                    variant={
                      isProLink ? "default" : isActive ? "secondary" : "ghost"
                    }
                    size="sm"
                    className={"gap-2"}
                  >
                    <Link to={item.path}>
                      {Icon && (
                        <Icon className={isHome ? "w-4 h-4" : "w-4 h-4"} />
                      )}
                      <span className="hidden sm:inline">{item.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>

            {/* Mobile menu trigger */}
            <div className="sm:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-lg flex items-center gap-2">
                      BreakEven
                      {isProUser && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded border bg-primary/10 text-primary border-primary/20">
                          Pro
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      const Icon = item.icon;
                      const isProLink = item.path === "/pro";
                      return (
                        <Button
                          key={item.path}
                          asChild
                          variant={
                            isProLink
                              ? "default"
                              : isActive
                              ? "secondary"
                              : "ghost"
                          }
                          className={"justify-start gap-3"}
                        >
                          <Link to={item.path}>
                            {Icon && <Icon className="w-4 h-4" />}
                            {item.label}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-4 w-4">
                          <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </div>
                        <span className="text-sm">Theme</span>
                      </div>
                      <Switch
                        checked={theme === "dark"}
                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                        aria-label="Toggle theme"
                      />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
