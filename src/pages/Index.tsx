import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Helmet } from "react-helmet-async";
import CalculatorCard, { CalculatorCardProps } from "@/components/CalculatorCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  ArrowRight,
  Sparkles,
  BarChart3,
} from "lucide-react";

const Index = () => {
  const calculators: CalculatorCardProps[] = [
    {
      title: "ROI Calculator",
      description:
        "Estimate when your side project breaks even based on costs, pricing, and growth.",
      icon: Calculator,
      to: "/roi-calculator",
      tier: "Core",
    },
    {
      title: "Pricing Calculator",
      description:
        "Experiment with price points and conversion rates to optimize revenue.",
      icon: DollarSign,
      to: "/pricing-calculator",
      tier: "Core",
    },
    {
      title: "Churn Calculator",
      description:
        "Compute the impact of churn rate on recurring revenue over time.",
      icon: Users,
      to: "/churn-calculator",
      tier: "Pro",
    },
    {
      title: "MRR Growth Simulator",
      description:
        "Visualize monthly recurring revenue growth with adjustable inputs.",
      icon: TrendingUp,
      to: "/mrr-simulator",
      tier: "Pro",
    },
    {
      title: "Retention Impact",
      description:
        "See how retention improvements affect lifetime value and profit.",
      icon: Target,
      to: "/retention-calculator",
      tier: "Pro",
    },
  ];

  const testimonials = [
    {
      quote: "Finally, a toolkit that speaks my language. No BS, just numbers.",
      author: "Alex Chen",
      role: "Indie Maker",
    },
    {
      quote: "Helped me price my SaaS with confidence. Worth every minute.",
      author: "Sarah Rodriguez",
      role: "Solo Founder",
    },
    {
      quote: "Clean, fast, and exactly what I needed to validate my ideas.",
      author: "James Park",
      role: "Side Project Enthusiast",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>BreakEven - Financial Calculators for Side Projects</title>
        <meta
          name="description"
          content="Free financial calculators to help you make smarter decisions about pricing, growth, and profitability."
        />
        <link rel="canonical" href="https://breakeven.dev/" />
        <meta property="og:title" content="BreakEven - Financial Calculators for Side Projects" />
        <meta property="og:description" content="Free financial calculators to help you make smarter decisions about pricing, growth, and profitability." />
        <meta property="og:url" content="https://breakeven.dev/" />
      </Helmet>
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center animate-slide-up">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-accent/50 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Built for indie hackers
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Understand your side project's{" "}
              <span className="text-primary">potential</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Free financial calculators to help you make smarter decisions
              about pricing, growth, and profitability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2 text-base">
                <Link to="/roi-calculator">
                  Calculate my ROI
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="gap-2 text-base"
                onClick={() => {
                  const element = document.getElementById('calculators');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <BarChart3 className="w-5 h-5" />
                Browse tools
              </Button>
            </div>
          </div>
        </section>

        {/* Calculators Section */}
        <section id="calculators" className="container mx-auto px-4 py-20">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Five calculators, endless insights
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each tool is designed to give you clarity on a specific aspect of
              your project's finances.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {calculators.map((calc) => (
              <CalculatorCard key={calc.title} {...calc} />
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by indie makers
            </h2>
            <p className="text-lg text-muted-foreground">
              Join hundreds of developers making smarter business decisions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-in">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    "{testimonial.quote}"
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="bg-primary text-primary-foreground border-0 animate-slide-up">
            <CardContent className="py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to run the numbers?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Start with the ROI calculator and see when your project becomes
                profitable.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="gap-2 text-base"
              >
                <Link to="/roi-calculator">
                  Get started free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Index;
