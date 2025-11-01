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
  Legend,
} from "recharts";
import { exportToPNG, exportToPDF } from "@/lib/exportUtils";
import {
  copyToClipboard,
  generateShareableUrl,
  getUrlParams,
} from "@/lib/shareUtils";
import { useToast } from "@/hooks/use-toast";

const ChurnCalculator = () => {
  const { toast } = useToast();
  const [initialCustomers, setInitialCustomers] = useState(100);
  const [monthlyPrice, setMonthlyPrice] = useState(50);
  const [churnRate, setChurnRate] = useState(5);
  const [newCustomers, setNewCustomers] = useState(10);

  // Load URL params on mount
  useEffect(() => {
    const params = getUrlParams();
    const customers = params.get("customers");
    const price = params.get("price");
    const churn = params.get("churn");
    const newCust = params.get("new");

    if (customers) setInitialCustomers(Number(customers));
    if (price) setMonthlyPrice(Number(price));
    if (churn) setChurnRate(Number(churn));
    if (newCust) setNewCustomers(Number(newCust));
  }, []);

  const handleExportPNG = async () => {
    await exportToPNG("churn-export-area", "churn-calculator-export");
    toast({
      title: "Exported to PNG",
      description: "Your churn analysis has been exported successfully.",
    });
  };

  const handleExportPDF = async () => {
    await exportToPDF("churn-export-area", "churn-calculator-export");
    toast({
      title: "Exported to PDF",
      description: "Your churn analysis has been exported successfully.",
    });
  };

  const handleCopySummary = async () => {
    const data = calculateChurn();
    const finalData = data[data.length - 1];
    const totalLost =
      initialCustomers - finalData.customers + newCustomers * 12;
    const monthlyLoss = initialCustomers * (churnRate / 100) * monthlyPrice;

    const summary = `📊 My churn impact analysis
Initial customers: ${initialCustomers.toLocaleString()}
Monthly churn rate: ${churnRate}%
Price per customer: $${monthlyPrice}
New customers/month: ${newCustomers}
Customers after 12 months: ${Math.round(finalData.customers).toLocaleString()}
Monthly revenue loss: $${Math.round(monthlyLoss).toLocaleString()}
Annual revenue lost to churn: $${Math.round(monthlyLoss * 12).toLocaleString()}
Try it yourself at breakeven.app`;

    const success = await copyToClipboard(summary);
    if (success) {
      toast({
        title: "Summary copied!",
        description: "Ready to share your churn analysis.",
      });
    }
  };

  const handleShareLink = async () => {
    const url = generateShareableUrl({
      customers: initialCustomers,
      price: monthlyPrice,
      churn: churnRate,
      new: newCustomers,
    });

    const success = await copyToClipboard(url);
    if (success) {
      toast({
        title: "Link copied!",
        description: "Share this link to show your analysis.",
      });
    }
  };

  const calculateChurn = () => {
    const months = 12;
    const data = [];
    let customers = initialCustomers;

    for (let month = 0; month <= months; month++) {
      const churned = customers * (churnRate / 100);
      const mrr = customers * monthlyPrice;
      const revenueAtRisk = churned * monthlyPrice;

      data.push({
        month,
        customers: Math.round(customers),
        churned: Math.round(churned),
        mrr: Math.round(mrr),
        revenueAtRisk: Math.round(revenueAtRisk),
      });

      if (month < months) {
        customers = customers - churned + newCustomers;
      }
    }

    return data;
  };

  const data = calculateChurn();
  const finalData = data[data.length - 1];
  const monthlyChurnImpact = Math.round(
    initialCustomers * (churnRate / 100) * monthlyPrice
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-3">Churn Calculator</h1>
              <p className="text-xl text-muted-foreground">
                Understand your churn impact 📊
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

        <div id="churn-export-area" className="grid gap-8 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Your Metrics ⚙️</CardTitle>
              <CardDescription>Adjust to match your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="initialCustomers">
                  Initial Customers: {initialCustomers}
                </Label>
                <Slider
                  id="initialCustomers"
                  min={10}
                  max={1000}
                  step={10}
                  value={[initialCustomers]}
                  onValueChange={([value]) => setInitialCustomers(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="monthlyPrice">
                  Monthly Price per Customer: ${monthlyPrice}
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
                <Label htmlFor="churnRate">
                  Monthly Churn Rate: {churnRate}%
                </Label>
                <Slider
                  id="churnRate"
                  min={0}
                  max={20}
                  step={0.5}
                  value={[churnRate]}
                  onValueChange={([value]) => setChurnRate(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="newCustomers">
                  New Customers per Month: {newCustomers}
                </Label>
                <Slider
                  id="newCustomers"
                  min={0}
                  max={100}
                  step={5}
                  value={[newCustomers]}
                  onValueChange={([value]) => setNewCustomers(value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                You're losing ${monthlyChurnImpact.toLocaleString()}/month to
                churn 📉
              </CardTitle>
              <CardDescription>
                Customer count and revenue impact over 12 months
              </CardDescription>
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
                    yAxisId="left"
                    label={{
                      value: "Customers",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "MRR ($)",
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
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="customers"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    name="Customers"
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="mrr"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={3}
                    name="MRR"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 p-4 bg-accent/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Final Customers
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {finalData.customers}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly Churn Loss
                  </p>
                  <p className="text-2xl font-bold">
                    ${monthlyChurnImpact.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Annual Churn Impact
                  </p>
                  <p className="text-2xl font-bold text-destructive">
                    ${(monthlyChurnImpact * 12).toLocaleString()}
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

export default ChurnCalculator;
