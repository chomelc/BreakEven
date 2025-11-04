import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Info, KeyRound } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

type ProProps = {
  title?: string;
  subtitle?: string;
};

const Pro = ({ title, subtitle }: ProProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const computedTitle = title
    ? `${title} - ${t("proInfo.title")}`
    : t("pro.defaultTitle");
  const computedDescription = title
    ? t("pro.titleDescription", { title, subtitle: subtitle ?? "" }).replace(/\s+/g, " ").trim()
    : t("pro.defaultDescription");
  const canonicalUrl = `https://breakeven.dev${location.pathname}`;

  return (
    <div className="bg-background flex flex-col flex-1">
      <Helmet>
        <title>{computedTitle}</title>
        <meta name="description" content={computedDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={computedTitle} />
        <meta property="og:description" content={computedDescription} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>
      <Navigation />
      <main className="flex-1 flex items-center justify-center">
        <section className="container mx-auto px-4 py-20 w-full">
          {title && (
            <div className="mb-8 animate-slide-up">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-3">{title}</h1>
                {subtitle && (
                  <p className="text-xl text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </div>
          )}
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>{t("pro.unlock")}</CardTitle>
                <CardDescription
                  className="text-base text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: t("pro.supportDescription") }}
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  {t("pro.description")}
                </p>
                <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="gap-2 text-base"
                  >
                    <Link to="/pro">
                      <Info className="w-5 h-5" />
                      {t("pro.learnMore")}
                    </Link>
                  </Button>
                  <Button asChild className="gap-2">
                    <a
                      href="https://www.buymeacoffee.com/breakeven"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <KeyRound className="w-5 h-5" />
                      {t("pro.getPro")}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Pro;


