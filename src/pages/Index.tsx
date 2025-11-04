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
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  
  const calculators: CalculatorCardProps[] = [
    {
      title: t("home.calculators.roi.title"),
      description: t("home.calculators.roi.description"),
      icon: Calculator,
      to: "/roi-calculator",
      tier: "Core",
    },
    {
      title: t("home.calculators.pricing.title"),
      description: t("home.calculators.pricing.description"),
      icon: DollarSign,
      to: "/pricing-calculator",
      tier: "Core",
    },
    {
      title: t("home.calculators.churn.title"),
      description: t("home.calculators.churn.description"),
      icon: Users,
      to: "/churn-calculator",
      tier: "Pro",
    },
    {
      title: t("home.calculators.mrr.title"),
      description: t("home.calculators.mrr.description"),
      icon: TrendingUp,
      to: "/mrr-simulator",
      tier: "Pro",
    },
    {
      title: t("home.calculators.retention.title"),
      description: t("home.calculators.retention.description"),
      icon: Target,
      to: "/retention-calculator",
      tier: "Pro",
    },
  ];

  const testimonials = [
    {
      quote: t("home.testimonials.testimonial1"),
      author: t("home.testimonials.author1"),
      role: t("home.testimonials.role1"),
    },
    {
      quote: t("home.testimonials.testimonial2"),
      author: t("home.testimonials.author2"),
      role: t("home.testimonials.role2"),
    },
    {
      quote: t("home.testimonials.testimonial3"),
      author: t("home.testimonials.author3"),
      role: t("home.testimonials.role3"),
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
                {t("home.badge")}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t("home.title")}{" "}
              <span className="text-primary">{t("home.titleHighlight")}</span>
              {t("home.titleSuffix") && ` ${t("home.titleSuffix")}`}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("home.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2 text-base">
                <Link to="/roi-calculator">
                  {t("home.ctaCalculate")}
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
                {t("home.ctaBrowse")}
              </Button>
            </div>
          </div>
        </section>

        {/* Calculators Section */}
        <section id="calculators" className="container mx-auto px-4 py-20">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.calculatorsTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.calculatorsSubtitle")}
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
              {t("home.testimonialsTitle")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("home.testimonialsSubtitle")}
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
                {t("home.ctaTitle")}
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                {t("home.ctaSubtitle")}
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="gap-2 text-base"
              >
                <Link to="/roi-calculator">
                  {t("home.ctaButton")}
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
