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
import { Download, FileImage, Clipboard, Link } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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

const ROICalculator = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [setupCost, setSetupCost] = useState(5000);
  const [monthlyCost, setMonthlyCost] = useState(50);
  const [price, setPrice] = useState(29);
  const [initialUsers, setInitialUsers] = useState(10);
  const [growthRate, setGrowthRate] = useState(20);
  const [showProModal, setShowProModal] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);

  // Load URL params on mount
  useEffect(() => {
    const params = getUrlParams();
    const setup = params.get("setup");
    const monthly = params.get("monthly");
    const priceParam = params.get("price");
    const users = params.get("users");
    const growth = params.get("growth");

    if (setup) setSetupCost(Number(setup));
    if (monthly) setMonthlyCost(Number(monthly));
    if (priceParam) setPrice(Number(priceParam));
    if (users) setInitialUsers(Number(users));
    if (growth) setGrowthRate(Number(growth));
  }, []);

  const handleExportPNG = async () => {
    const result = await exportToPNG("roi-export-area", "roi-calculator-export");
    if (result.blocked) {
      setIsLimitReached(true);
      setShowProModal(true);
      return;
    }
    if (result.success) {
      toast({
        title: t("roi.toasts.exportedPngTitle"),
        description: t("roi.toasts.exportedPngDesc"),
      });
      if (result.shouldShowProModal) {
        setIsLimitReached(false);
        setShowProModal(true);
      }
    }
  };

  const handleExportPDF = async () => {
    const result = await exportToPDF("roi-export-area", "roi-calculator-export");
    if (result.blocked) {
      setIsLimitReached(true);
      setShowProModal(true);
      return;
    }
    if (result.success) {
      toast({
        title: t("roi.toasts.exportedPdfTitle"),
        description: t("roi.toasts.exportedPdfDesc"),
      });
      if (result.shouldShowProModal) {
        setIsLimitReached(false);
        setShowProModal(true);
      }
    }
  };

  const handleCopySummary = async () => {
    const data = calculateROI();
    const breakEven = data.find((d) => d.profit >= 0)?.month || null;
    const finalData = data[data.length - 1];

    const summary = t("roi.summary", {
      breakEven: breakEven || t("roi.moreThan24"),
      setupCost: setupCost.toLocaleString(),
      monthlyCost,
      price,
      initialUsers,
      growthRate,
      finalProfit: finalData.profit.toLocaleString(),
    });

    const success = await copyToClipboard(summary);
    if (success) {
      toast({
        title: t("roi.toasts.summaryCopiedTitle"),
        description: t("roi.toasts.summaryCopiedDesc"),
      });
    }
  };

  const handleShareLink = async () => {
    const url = generateShareableUrl({
      setup: setupCost,
      monthly: monthlyCost,
      price,
      users: initialUsers,
      growth: growthRate,
    });

    const success = await copyToClipboard(url);
    if (success) {
      toast({
        title: t("roi.toasts.linkCopiedTitle"),
        description: t("roi.toasts.linkCopiedDesc"),
      });
    }
  };

  const calculateROI = () => {
    const months = 24;
    const data = [];
    let totalCost = setupCost;
    let totalRevenue = 0;
    let users = initialUsers;

    for (let month = 0; month <= months; month++) {
      totalCost += monthlyCost;
      totalRevenue += users * price;
      const profit = totalRevenue - totalCost;

      data.push({
        month,
        cost: totalCost,
        revenue: totalRevenue,
        profit,
        users: Math.round(users),
      });

      users *= 1 + growthRate / 100;
    }

    return data;
  };

  const data = calculateROI();
  const breakEvenMonth = data.find((d) => d.profit >= 0)?.month || null;

  return (
    <div className="min-h-screen bg-background">
      <ProInviteModal open={showProModal} onOpenChange={setShowProModal} isLimitReached={isLimitReached} />
      <PageMeta namespace="roi" path="/roi-calculator" />
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-3">{t("roi.title")}</h1>
              <p className="text-xl text-muted-foreground">{t("roi.subtitle")}</p>
            </div>
            <CalculatorActions
              namespace="roi"
              onCopySummary={handleCopySummary}
              onShareLink={handleShareLink}
              onExportPNG={handleExportPNG}
              onExportPDF={handleExportPDF}
            />
          </div>
        </div>

        <div id="roi-export-area" className="grid gap-8 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>{t("roi.inputs.title")}</CardTitle>
              <CardDescription>{t("roi.inputs.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="setupCost">{t("roi.inputs.setupCost", { value: setupCost.toLocaleString() })}</Label>
                <Slider
                  id="setupCost"
                  min={0}
                  max={20000}
                  step={500}
                  value={[setupCost]}
                  onValueChange={([value]) => setSetupCost(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="monthlyCost">{t("roi.inputs.monthlyCost", { value: monthlyCost })}</Label>
                <Slider
                  id="monthlyCost"
                  min={0}
                  max={500}
                  step={10}
                  value={[monthlyCost]}
                  onValueChange={([value]) => setMonthlyCost(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="price">{t("roi.inputs.price", { value: price })}</Label>
                <Slider
                  id="price"
                  min={5}
                  max={200}
                  step={1}
                  value={[price]}
                  onValueChange={([value]) => setPrice(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="initialUsers">{t("roi.inputs.initialUsers", { value: initialUsers })}</Label>
                <Slider
                  id="initialUsers"
                  min={1}
                  max={100}
                  step={1}
                  value={[initialUsers]}
                  onValueChange={([value]) => setInitialUsers(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="growthRate">{t("roi.inputs.growthRate", { value: growthRate })}</Label>
                <Slider
                  id="growthRate"
                  min={0}
                  max={100}
                  step={5}
                  value={[growthRate]}
                  onValueChange={([value]) => setGrowthRate(value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {breakEvenMonth !== null
                  ? t("roi.chart.titleWithBreakEven", { months: breakEvenMonth })
                  : t("roi.chart.titleNoBreakEven")}
              </CardTitle>
              <CardDescription>{t("roi.chart.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="month"
                    label={{
                      value: t("roi.chart.xAxis"),
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: t("roi.chart.yAxis"),
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <ReferenceLine
                    y={0}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="3 3"
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    name={t("roi.series.revenue")}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={3}
                    name={t("roi.series.cost")}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name={t("roi.series.profit")}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 p-4 bg-accent/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">{t("roi.stats.finalRevenue")}</p>
                  <p className="text-2xl font-bold text-primary">
                    ${data[data.length - 1].revenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("roi.stats.totalCost")}</p>
                  <p className="text-2xl font-bold">
                    ${data[data.length - 1].cost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("roi.stats.finalUsers")}</p>
                  <p className="text-2xl font-bold">
                    {data[data.length - 1].users.toLocaleString()}
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

export default ROICalculator;
