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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { exportToPNG, exportToPDF } from "@/lib/exportUtils";
import {
  copyToClipboard,
  generateShareableUrl,
  getUrlParams,
} from "@/lib/shareUtils";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";

const RetentionCalculator = () => {
  const { toast } = useToast();
  const [monthlyPrice, setMonthlyPrice] = useState(50);
  const [retentionRate, setRetentionRate] = useState(85);
  const [acquisitionCost, setAcquisitionCost] = useState(150);
  const [grossMargin, setGrossMargin] = useState(80);

  // Load URL params on mount
  useEffect(() => {
    const params = getUrlParams();
    const price = params.get("price");
    const retention = params.get("retention");
    const cac = params.get("cac");
    const margin = params.get("margin");

    if (price) setMonthlyPrice(Number(price));
    if (retention) setRetentionRate(Number(retention));
    if (cac) setAcquisitionCost(Number(cac));
    if (margin) setGrossMargin(Number(margin));
  }, []);

  const handleExportPNG = async () => {
    await exportToPNG("retention-export-area", "retention-calculator-export");
    toast({
      title: "Exported to PNG",
      description: "Your retention analysis has been exported successfully.",
    });
  };

  const handleExportPDF = async () => {
    await exportToPDF("retention-export-area", "retention-calculator-export");
    toast({
      title: "Exported to PDF",
      description: "Your retention analysis has been exported successfully.",
    });
  };

  const calculateLTV = (retention: number) => {
    const churnRate = (100 - retention) / 100;
    const avgLifetimeMonths = churnRate > 0 ? 1 / churnRate : 100;
    const revenue = avgLifetimeMonths * monthlyPrice;
    const ltv = revenue * (grossMargin / 100);
    return { ltv, avgLifetimeMonths, revenue };
  };

  const handleCopySummary = async () => {
    const { ltv, avgLifetimeMonths } = calculateLTV(retentionRate);
    const ltvCacRatio = ltv / acquisitionCost;
    const breakEvenMonths =
      acquisitionCost / (monthlyPrice * (grossMargin / 100));

    const summary = `🎯 My retention impact analysis
Monthly price: $${monthlyPrice}
Retention rate: ${retentionRate}%
Customer lifetime: ${avgLifetimeMonths.toFixed(1)} months
Customer LTV: $${Math.round(ltv).toLocaleString()}
CAC: $${acquisitionCost}
LTV:CAC ratio: ${ltvCacRatio.toFixed(1)}:1
Break-even: ${breakEvenMonths.toFixed(1)} months
Try it yourself at https://breakeven.dev`;

    const success = await copyToClipboard(summary);
    if (success) {
      toast({
        title: "Summary copied!",
        description: "Ready to share your retention analysis.",
      });
    }
  };

  const handleShareLink = async () => {
    const url = generateShareableUrl({
      price: monthlyPrice,
      retention: retentionRate,
      cac: acquisitionCost,
      margin: grossMargin,
    });

    const success = await copyToClipboard(url);
    if (success) {
      toast({
        title: "Link copied!",
        description: "Share this link to show your analysis.",
      });
    }
  };

  const generateComparisonData = () => {
    const retentionRates = [70, 75, 80, 85, 90, 95];
    return retentionRates.map((rate) => {
      const { ltv } = calculateLTV(rate);
      const ltvCacRatio = ltv / acquisitionCost;
      return {
        retention: `${rate}%`,
        ltv: Math.round(ltv),
        ltvCacRatio: parseFloat(ltvCacRatio.toFixed(2)),
      };
    });
  };

  const data = generateComparisonData();
  const { ltv, avgLifetimeMonths } = calculateLTV(retentionRate);
  const ltvCacRatio = ltv / acquisitionCost;
  const breakEvenMonths =
    acquisitionCost / (monthlyPrice * (grossMargin / 100));

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Retention Impact Calculator - BreakEven</title>
        <meta name="description" content="See how retention improvements affect customer lifetime value and overall profitability." />
        <link rel="canonical" href="https://breakeven.dev/retention-calculator" />
        <meta property="og:title" content="Retention Impact Calculator - BreakEven" />
        <meta property="og:description" content="See how retention improvements affect customer lifetime value and overall profitability." />
        <meta property="og:url" content="https://breakeven.dev/retention-calculator" />
      </Helmet>
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-3">
                Retention Impact Calculator
              </h1>
              <p className="text-xl text-muted-foreground">
                See how retention affects LTV 🎯
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCopySummary} variant="outline" size="sm">
                <Clipboard className="w-4 h-4" />
                Copy Summary
              </Button>
              <Button onClick={handleShareLink} variant="outline" size="sm">
                <Link className="w-4 h-4" />
                Share Link
              </Button>
              <Button onClick={handleExportPNG} variant="outline" size="sm">
                <FileImage className="w-4 h-4" />
                PNG
              </Button>
              <Button onClick={handleExportPDF} variant="outline" size="sm">
                <Download className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        <div id="retention-export-area" className="grid gap-8 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Your Business Metrics ⚙️</CardTitle>
              <CardDescription>Adjust to see retention impact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="monthlyPrice">
                  Monthly Price: ${monthlyPrice}
                </Label>
                <Slider
                  id="monthlyPrice"
                  min={5}
                  max={500}
                  step={5}
                  value={[monthlyPrice]}
                  onValueChange={([value]) => setMonthlyPrice(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="retentionRate">
                  Monthly Retention Rate: {retentionRate}%
                </Label>
                <Slider
                  id="retentionRate"
                  min={50}
                  max={99}
                  step={1}
                  value={[retentionRate]}
                  onValueChange={([value]) => setRetentionRate(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="acquisitionCost">
                  Customer Acquisition Cost: ${acquisitionCost}
                </Label>
                <Slider
                  id="acquisitionCost"
                  min={10}
                  max={1000}
                  step={10}
                  value={[acquisitionCost]}
                  onValueChange={([value]) => setAcquisitionCost(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="grossMargin">
                  Gross Margin: {grossMargin}%
                </Label>
                <Slider
                  id="grossMargin"
                  min={20}
                  max={100}
                  step={5}
                  value={[grossMargin]}
                  onValueChange={([value]) => setGrossMargin(value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Your LTV is ${Math.round(ltv).toLocaleString()} with{" "}
                {ltvCacRatio.toFixed(1)}:1 LTV:CAC 💰
              </CardTitle>
              <CardDescription>
                See how different retention rates impact lifetime value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="retention"
                    label={{
                      value: "Retention Rate",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: "LTV ($)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "LTV:CAC Ratio",
                      angle: 90,
                      position: "insideRight",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="ltv"
                    fill="hsl(var(--chart-1))"
                    radius={[8, 8, 0, 0]}
                    name="Lifetime Value ($)"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="ltvCacRatio"
                    fill="hsl(var(--chart-4))"
                    radius={[8, 8, 0, 0]}
                    name="LTV:CAC Ratio"
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 p-4 bg-accent/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Customer LTV</p>
                  <p className="text-2xl font-bold text-primary">
                    ${Math.round(ltv).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Average Lifetime
                  </p>
                  <p className="text-2xl font-bold">
                    {avgLifetimeMonths.toFixed(1)} months
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Break-even Time
                  </p>
                  <p className="text-2xl font-bold">
                    {breakEvenMonths.toFixed(1)} months
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

export default RetentionCalculator;
