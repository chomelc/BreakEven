import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Calculator, Github } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Index from "./pages/Index";
import ROICalculator from "./pages/ROICalculator";
import PricingCalculator from "./pages/PricingCalculator";
import ChurnCalculator from "./pages/ChurnCalculator";
import MRRSimulator from "./pages/MRRSimulator";
import RetentionCalculator from "./pages/RetentionCalculator";
import Pro from "./pages/Pro";
import ProInfo from "./pages/ProInfo";
import { hasValidLicenseKeySync, isPro } from "./lib/license";
import NotFound from "./pages/NotFound";

// Wrapper component to use translations in routes
const ProRouteWrapper = ({ calculatorKey }: { calculatorKey: "churn" | "mrr" | "retention" }) => {
  const { t } = useTranslation();
  return (
    <Pro 
      title={t(`pro.calculators.${calculatorKey}.title`)} 
      subtitle={t(`pro.calculators.${calculatorKey}.subtitle`)} 
    />
  );
};

const queryClient = new QueryClient();

// Component wrapper to handle async Pro check for routes
const ProRoute = ({ children }: { children: React.ReactElement }) => {
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

  if (isProUser) {
    return children;
  }
  return null;
};

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="border-t bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">BreakEven</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.buymeacoffee.com/breakeven"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="h-10"
                  alt="Support BreakEven on Buy Me a Coffee"
                  src="https://img.buymeacoffee.com/button-api/?text=Support%20BreakEven&emoji=%F0%9F%9A%80&slug=breakeven&button_colour=10b77f&font_colour=ffffff&font_family=Inter&outline_colour=ffffff&coffee_colour=FFDD00"
                />
              </a>
              <a
                href="https://github.com/chomelc/BreakEven"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View BreakEven on GitHub"
                className="inline-flex items-center justify-center rounded-md border bg-background hover:bg-accent text-foreground h-10 w-10 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  // Track pro status at App level to make routes reactive
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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HelmetProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pro" element={<ProInfo />} />
              <Route path="/roi-calculator" element={<ROICalculator />} />
              <Route path="/pricing-calculator" element={<PricingCalculator />} />
              <Route
                path="/churn-calculator"
                element={
                  isProUser ? (
                    <ProRoute>
                      <ChurnCalculator />
                    </ProRoute>
                  ) : (
                    <ProRouteWrapper calculatorKey="churn" />
                  )
                }
              />
              <Route
                path="/mrr-simulator"
                element={
                  isProUser ? (
                    <ProRoute>
                      <MRRSimulator />
                    </ProRoute>
                  ) : (
                    <ProRouteWrapper calculatorKey="mrr" />
                  )
                }
              />
              <Route
                path="/retention-calculator"
                element={
                  isProUser ? (
                    <ProRoute>
                      <RetentionCalculator />
                    </ProRoute>
                  ) : (
                    <ProRouteWrapper calculatorKey="retention" />
                  )
                }
              />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>

            <Footer />
          </div>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
