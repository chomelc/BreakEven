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
import { Input } from "@/components/ui/input";
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
import { Helmet } from "react-helmet-async";
import { ProInviteModal } from "@/components/ProInviteModal";

const ROICalculator = () => {
  const { toast } = useToast();
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
        title: "Exported to PNG",
        description: "Your ROI calculation has been exported successfully.",
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
        title: "Exported to PDF",
        description: "Your ROI calculation has been exported successfully.",
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

    const summary = `💰 My project breaks even in ${
      breakEven || "more than 24"
    } months
Setup cost: $${setupCost.toLocaleString()}
Monthly cost: $${monthlyCost}
Price per user: $${price}
Initial users: ${initialUsers}
Growth rate: ${growthRate}%/month
Profit after 24 months: $${finalData.profit.toLocaleString()}
Try it yourself at breakeven.dev`;

    const success = await copyToClipboard(summary);
    if (success) {
      toast({
        title: "Summary copied!",
        description: "Ready to share your ROI calculation.",
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
        title: "Link copied!",
        description: "Share this link to show your calculation.",
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
      <Helmet>
        <title>ROI Calculator - BreakEven</title>
        <meta name="description" content="Estimate when your side project breaks even based on costs, pricing, and growth projections." />
        <link rel="canonical" href="https://breakeven.dev/roi-calculator" />
        <meta property="og:title" content="ROI Calculator - BreakEven" />
        <meta property="og:description" content="Estimate when your side project breaks even based on costs, pricing, and growth projections." />
        <meta property="og:url" content="https://breakeven.dev/roi-calculator" />
      </Helmet>
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-3">ROI Calculator</h1>
              <p className="text-xl text-muted-foreground">
                Estimate when your side project breaks even 💰
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

        <div id="roi-export-area" className="grid gap-8 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Your Assumptions ⚙️</CardTitle>
              <CardDescription>
                Tweak the numbers to match your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="setupCost">
                  Setup Cost: ${setupCost.toLocaleString()}
                </Label>
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
                <Label htmlFor="monthlyCost">
                  Monthly Recurring Cost: ${monthlyCost}
                </Label>
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
                <Label htmlFor="price">Price per User/Month: ${price}</Label>
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
                <Label htmlFor="initialUsers">
                  Initial Users: {initialUsers}
                </Label>
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
                <Label htmlFor="growthRate">
                  Monthly Growth Rate: {growthRate}%
                </Label>
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
                  ? `You'll break even in ${breakEvenMonth} months 🎉`
                  : "Keep growing to reach break-even 📈"}
              </CardTitle>
              <CardDescription>Revenue vs. Cost over 24 months</CardDescription>
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
                      value: "Month",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Amount ($)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
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
                    name="Revenue"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={3}
                    name="Cost"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Profit"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 p-4 bg-accent/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Final Revenue</p>
                  <p className="text-2xl font-bold text-primary">
                    ${data[data.length - 1].revenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold">
                    ${data[data.length - 1].cost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Final Users</p>
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
