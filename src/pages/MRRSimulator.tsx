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
  AreaChart,
  Area,
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

const MRRSimulator = () => {
  const { toast } = useToast();
  const [startingMRR, setStartingMRR] = useState(5000);
  const [newMRR, setNewMRR] = useState(1000);
  const [churnRate, setChurnRate] = useState(5);
  const [expansionRate, setExpansionRate] = useState(2);

  // Load URL params on mount
  useEffect(() => {
    const params = getUrlParams();
    const starting = params.get("starting");
    const newMrr = params.get("new");
    const churn = params.get("churn");
    const expansion = params.get("expansion");

    if (starting) setStartingMRR(Number(starting));
    if (newMrr) setNewMRR(Number(newMrr));
    if (churn) setChurnRate(Number(churn));
    if (expansion) setExpansionRate(Number(expansion));
  }, []);

  const handleExportPNG = async () => {
    await exportToPNG("mrr-export-area", "mrr-simulator-export");
    toast({
      title: "Exported to PNG",
      description: "Your MRR simulation has been exported successfully.",
    });
  };

  const handleExportPDF = async () => {
    await exportToPDF("mrr-export-area", "mrr-simulator-export");
    toast({
      title: "Exported to PDF",
      description: "Your MRR simulation has been exported successfully.",
    });
  };

  const handleCopySummary = async () => {
    const data = calculateMRR();
    const finalData = data[data.length - 1];
    const growth = (
      ((finalData.totalMRR - startingMRR) / startingMRR) *
      100
    ).toFixed(1);

    const summary = `📈 My MRR growth projection
Starting MRR: $${startingMRR.toLocaleString()}
New MRR/month: $${newMRR.toLocaleString()}
Churn rate: ${churnRate}%
Expansion rate: ${expansionRate}%
MRR after 12 months: $${finalData.totalMRR.toLocaleString()}
Total growth: ${growth}%
Try it yourself at https://breakeven.dev`;

    const success = await copyToClipboard(summary);
    if (success) {
      toast({
        title: "Summary copied!",
        description: "Ready to share your MRR projection.",
      });
    }
  };

  const handleShareLink = async () => {
    const url = generateShareableUrl({
      starting: startingMRR,
      new: newMRR,
      churn: churnRate,
      expansion: expansionRate,
    });

    const success = await copyToClipboard(url);
    if (success) {
      toast({
        title: "Link copied!",
        description: "Share this link to show your projection.",
      });
    }
  };

  const calculateMRR = () => {
    const months = 12;
    const data = [];
    let currentMRR = startingMRR;

    for (let month = 0; month <= months; month++) {
      const churnedMRR = currentMRR * (churnRate / 100);
      const expansionMRR = currentMRR * (expansionRate / 100);
      const netNewMRR = newMRR - churnedMRR + expansionMRR;

      data.push({
        month,
        newMRR: Math.round(newMRR),
        churnedMRR: Math.round(churnedMRR),
        expansionMRR: Math.round(expansionMRR),
        totalMRR: Math.round(currentMRR),
        netGrowth: Math.round(netNewMRR),
      });

      if (month < months) {
        currentMRR = currentMRR + netNewMRR;
      }
    }

    return data;
  };

  const data = calculateMRR();
  const finalData = data[data.length - 1];
  const totalGrowth = (
    ((finalData.totalMRR - startingMRR) / startingMRR) *
    100
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>MRR Growth Simulator - BreakEven</title>
        <meta name="description" content="Visualize monthly recurring revenue growth with adjustable inputs and projections." />
        <link rel="canonical" href="https://breakeven.dev/mrr-simulator" />
        <meta property="og:title" content="MRR Growth Simulator - BreakEven" />
        <meta property="og:description" content="Visualize monthly recurring revenue growth with adjustable inputs and projections." />
        <meta property="og:url" content="https://breakeven.dev/mrr-simulator" />
      </Helmet>
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-3">MRR Growth Simulator</h1>
              <p className="text-xl text-muted-foreground">
                Visualize your MRR growth 📈
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

        <div id="mrr-export-area" className="grid gap-8 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Your MRR Metrics ⚙️</CardTitle>
              <CardDescription>
                Model your recurring revenue growth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="startingMRR">
                  Starting MRR: ${startingMRR.toLocaleString()}
                </Label>
                <Slider
                  id="startingMRR"
                  min={0}
                  max={50000}
                  step={1000}
                  value={[startingMRR]}
                  onValueChange={([value]) => setStartingMRR(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="newMRR">
                  New MRR per Month: ${newMRR.toLocaleString()}
                </Label>
                <Slider
                  id="newMRR"
                  min={0}
                  max={10000}
                  step={100}
                  value={[newMRR]}
                  onValueChange={([value]) => setNewMRR(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="churnRate">Churn Rate: {churnRate}%</Label>
                <Slider
                  id="churnRate"
                  min={0}
                  max={15}
                  step={0.5}
                  value={[churnRate]}
                  onValueChange={([value]) => setChurnRate(value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="expansionRate">
                  Expansion Rate: {expansionRate}%
                </Label>
                <Slider
                  id="expansionRate"
                  min={0}
                  max={10}
                  step={0.5}
                  value={[expansionRate]}
                  onValueChange={([value]) => setExpansionRate(value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Your MRR will grow {totalGrowth}% to $
                {finalData.totalMRR.toLocaleString()} 🚀
              </CardTitle>
              <CardDescription>
                MRR growth breakdown over 12 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data}>
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
                      value: "MRR ($)",
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
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="totalMRR"
                    stackId="1"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.6}
                    name="Total MRR"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 p-4 bg-accent/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Final MRR</p>
                  <p className="text-2xl font-bold text-primary">
                    ${finalData.totalMRR.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Growth</p>
                  <p className="text-2xl font-bold">{totalGrowth}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Net Monthly Growth
                  </p>
                  <p className="text-2xl font-bold">
                    ${finalData.netGrowth.toLocaleString()}
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

export default MRRSimulator;
