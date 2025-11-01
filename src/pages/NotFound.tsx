import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="bg-background flex flex-col flex-1">
      <Navigation />
      <main className="flex-1 flex items-center justify-center">
        <section className="container mx-auto px-4 py-20 w-full">
          <div className="max-w-2xl mx-auto text-center animate-slide-up">
            <Card className="border-2">
              <CardContent className="py-16">
                <h1 className="mb-4 text-6xl md:text-7xl font-bold">404</h1>
                <p className="mb-6 text-xl md:text-2xl text-muted-foreground">
                  Oops! Page not found
                </p>
                <p className="mb-8 text-muted-foreground">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <Button asChild size="lg" className="gap-2 text-base">
                  <Link to="/">
                    <ArrowLeft className="w-5 h-5" />
                    Return to Home
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NotFound;
