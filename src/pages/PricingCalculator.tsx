import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { exportToPNG, exportToPDF } from "@/lib/exportUtils";
import {
  copyToClipboard,
  generateShareableUrl,
  getUrlParams,
} from "@/lib/shareUtils";
import { useToast } from "@/hooks/use-toast";
import { PageMeta } from "@/components/PageMeta";
import { CalculatorActions } from "@/components/CalculatorActions";
import { CHART_TOOLTIP_STYLE } from "@/lib/chartConfig";
import { ProInviteModal } from "@/components/ProInviteModal";
import { useTranslation } from "react-i18next";

const PricingCalculator = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [visitors, setVisitors] = useState(1000);
  const [conversionRate, setConversionRate] = useState(5);
  const [pricePoint, setPricePoint] = useState(29);
  const [showProModal, setShowProModal] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);

  // Load URL params on mount
  useEffect(() => {
    const params = getUrlParams();
    const visitorsParam = params.get("visitors");
    const conversionParam = params.get("conversion");
    const priceParam = params.get("price");

    if (visitorsParam) setVisitors(Number(visitorsParam));
    if (conversionParam) setConversionRate(Number(conversionParam));
    if (priceParam) setPricePoint(Number(priceParam));
  }, []);

  const handleExportPNG = async () => {
    const result = await exportToPNG("pricing-export-area", "pricing-calculator-export");
    if (result.blocked) {
      setIsLimitReached(true);
      setShowProModal(true);
      return;
    }
    if (result.success) {
      toast({
        title: t("pricing.toasts.exportedPngTitle"),
        description: t("pricing.toasts.exportedPngDesc"),
      });
      if (result.shouldShowProModal) {
        setIsLimitReached(false);
        setShowProModal(true);
      }
    }
  };

  const handleExportPDF = async () => {
    const result = await exportToPDF("pricing-export-area", "pricing-calculator-export");
    if (result.blocked) {
      setIsLimitReached(true);
      setShowProModal(true);
      return;
    }
    if (result.success) {
      toast({
        title: t("pricing.toasts.exportedPdfTitle"),
        description: t("pricing.toasts.exportedPdfDesc"),
      });
      if (result.shouldShowProModal) {
        setIsLimitReached(false);
        setShowProModal(true);
      }
    }
  };

  const handleCopySummary = async () => {
    const data = calculatePricing();
    const selectedData = data.find((d) => d.priceValue === pricePoint);

    const summary = t("pricing.summary", {
      visitors: visitors.toLocaleString(),
      conversionRate,
      pricePoint,
      users: selectedData?.users.toLocaleString() || 0,
      mrr: selectedData?.mrr.toLocaleString() || 0,
      annual: ((selectedData?.mrr || 0) * 12).toLocaleString(),
    });

    const success = await copyToClipboard(summary);
    if (success) {
      toast({
        title: t("pricing.toasts.summaryCopiedTitle"),
        description: t("pricing.toasts.summaryCopiedDesc"),
      });
    }
  };

  const handleShareLink = async () => {
    const url = generateShareableUrl({
      visitors,
      conversion: conversionRate,
      price: pricePoint,
    });

    const success = await copyToClipboard(url);
    if (success) {
      toast({
        title: t("pricing.toasts.linkCopiedTitle"),
        description: t("pricing.toasts.linkCopiedDesc"),
      });
    }
  };

  const calculatePricing = () => {
    const pricePoints = [9, 19, 29, 49, 99];
    const data = pricePoints.map((price) => {
      // Lower prices = higher conversion (simplified model)
      const adjustedConversion = conversionRate * (pricePoint / price);
      const users = Math.round(visitors * (adjustedConversion / 100));
      const mrr = users * price;

      return {
        price: `$${price}`,
        priceValue: price,
        users,
        mrr,
      };
    });

    return data;
  };

  const data = calculatePricing();
  const selectedData = data.find((d) => d.priceValue === pricePoint);

  return (
    <div className="min-h-screen bg-background">
      <ProInviteModal open={showProModal} onOpenChange={setShowProModal} isLimitReached={isLimitReached} />
      <PageMeta namespace="pricing" path="/pricing-calculator" />
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-3">{t("pricing.title")}</h1>
              <p className="text-xl text-muted-foreground">{t("pricing.subtitle")}</p>
            </div>
            <CalculatorActions
              namespace="pricing"
              onCopySummary={handleCopySummary}
              onShareLink={handleShareLink}
              onExportPNG={handleExportPNG}
              onExportPDF={handleExportPDF}
            />
          </div>
        </div>

        <div id="pricing-export-area" className="grid gap-8 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>{t("pricing.inputs.title")}</CardTitle>
              <CardDescription>{t("pricing.inputs.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="visitors">{t("pricing.inputs.visitors", { value: visitors.toLocaleString() })}</Label>
                <Slider
                  id="visitors"
                  min={100}
                  max={10000}
                  step={100}
                  value={[visitors]}
                  onValueChange={([value]) => setVisitors(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="conversionRate">{t("pricing.inputs.conversion", { value: conversionRate })}</Label>
                <Slider
                  id="conversionRate"
                  min={1}
                  max={20}
                  step={0.5}
                  value={[conversionRate]}
                  onValueChange={([value]) => setConversionRate(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="pricePoint">{t("pricing.inputs.price", { value: pricePoint })}</Label>
                <Slider
                  id="pricePoint"
                  min={9}
                  max={99}
                  step={10}
                  value={[pricePoint]}
                  onValueChange={([value]) => setPricePoint(value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("pricing.chart.title", { price: pricePoint, mrr: selectedData?.mrr.toLocaleString() })}</CardTitle>
              <CardDescription>{t("pricing.chart.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="price"
                    label={{
                      value: t("pricing.chart.xAxis"),
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: t("pricing.chart.yAxis"),
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar
                    dataKey="mrr"
                    fill="hsl(var(--chart-1))"
                    radius={[8, 8, 0, 0]}
                    name={t("pricing.series.mrr")}
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-4 bg-accent/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">{t("pricing.stats.users")}</p>
                  <p className="text-2xl font-bold text-primary">
                    {selectedData?.users.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("pricing.stats.annual")}</p>
                  <p className="text-2xl font-bold">
                    ${((selectedData?.mrr || 0) * 12).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PricingCalculator;
