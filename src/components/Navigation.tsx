import { Link, useLocation } from "react-router-dom";
import {
  Calculator,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/roi-calculator", label: "ROI", icon: Calculator },
    { path: "/pricing-calculator", label: "Pricing", icon: DollarSign },
    { path: "/churn-calculator", label: "Churn", icon: Users },
    { path: "/mrr-simulator", label: "MRR", icon: TrendingUp },
    { path: "/retention-calculator", label: "Retention", icon: Target },
  ];

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calculator className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg hidden sm:inline">
              BreakEven
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                const isHome = item.path === "/";

                return (
                  <Button
                    key={item.path}
                    asChild
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Link to={item.path}>
                      {Icon && (
                        <Icon
                          className={isHome ? "w-4 h-4 sm:hidden" : "w-4 h-4"}
                        />
                      )}
                      <span className="hidden sm:inline">{item.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
