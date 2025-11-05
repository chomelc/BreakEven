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
import { useTranslation } from "react-i18next";

const MRRSimulator = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
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
      title: t("mrr.toasts.exportedPngTitle"),
      description: t("mrr.toasts.exportedPngDesc"),
    });
  };

  const handleExportPDF = async () => {
    await exportToPDF("mrr-export-area", "mrr-simulator-export");
    toast({
      title: t("mrr.toasts.exportedPdfTitle"),
      description: t("mrr.toasts.exportedPdfDesc"),
    });
  };

  const handleCopySummary = async () => {
    const data = calculateMRR();
    const finalData = data[data.length - 1];
    const growth = (
      ((finalData.totalMRR - startingMRR) / startingMRR) *
      100
    ).toFixed(1);

    const summary = t("mrr.summary", {
      startingMRR: startingMRR.toLocaleString(),
      newMRR: newMRR.toLocaleString(),
      churnRate,
      expansionRate,
      finalMRR: finalData.totalMRR.toLocaleString(),
      growth,
    });

    const success = await copyToClipboard(summary);
    if (success) {
      toast({
        title: t("mrr.toasts.summaryCopiedTitle"),
        description: t("mrr.toasts.summaryCopiedDesc"),
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
        <title>{t("mrr.meta.title")}</title>
        <meta name="description" content={t("mrr.meta.description")} />
        <link rel="canonical" href="https://breakeven.dev/mrr-simulator" />
        <meta property="og:title" content={t("mrr.meta.title")} />
        <meta property="og:description" content={t("mrr.meta.description")} />
        <meta property="og:url" content="https://breakeven.dev/mrr-simulator" />
      </Helmet>
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-3">{t("pro.calculators.mrr.title")}</h1>
              <p className="text-xl text-muted-foreground">{t("pro.calculators.mrr.subtitle")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCopySummary} variant="outline" size="sm">
                <Clipboard className="w-4 h-4" />
                {t("mrr.actions.copySummary")}
              </Button>
              <Button onClick={handleShareLink} variant="outline" size="sm">
                <Link className="w-4 h-4" />
                {t("mrr.actions.shareLink")}
              </Button>
              <Button onClick={handleExportPNG} variant="outline" size="sm">
                <FileImage className="w-4 h-4" />
                {t("mrr.actions.png")}
              </Button>
              <Button onClick={handleExportPDF} variant="outline" size="sm">
                <Download className="w-4 h-4" />
                {t("mrr.actions.pdf")}
              </Button>
            </div>
          </div>
        </div>

        <div id="mrr-export-area" className="grid gap-8 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>{t("mrr.inputs.title")}</CardTitle>
              <CardDescription>{t("mrr.inputs.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="startingMRR">{t("mrr.inputs.startingMRR", { value: startingMRR.toLocaleString() })}</Label>
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
                <Label htmlFor="newMRR">{t("mrr.inputs.newMRR", { value: newMRR.toLocaleString() })}</Label>
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
                <Label htmlFor="churnRate">{t("mrr.inputs.churnRate", { value: churnRate })}</Label>
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
                <Label htmlFor="expansionRate">{t("mrr.inputs.expansionRate", { value: expansionRate })}</Label>
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
              <CardTitle>{t("mrr.chart.title", { growth: totalGrowth, final: finalData.totalMRR.toLocaleString() })}</CardTitle>
              <CardDescription>{t("mrr.chart.description")}</CardDescription>
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
                      value: t("mrr.chart.xAxis"),
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: t("mrr.chart.yAxis"),
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
                    name={t("mrr.series.totalMRR")}
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 p-4 bg-accent/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">{t("mrr.stats.finalMRR")}</p>
                  <p className="text-2xl font-bold text-primary">
                    ${finalData.totalMRR.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("mrr.stats.totalGrowth")}</p>
                  <p className="text-2xl font-bold">{totalGrowth}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("mrr.stats.netGrowth")}</p>
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
