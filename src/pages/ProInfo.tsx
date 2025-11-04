import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle2, Lock, Medal, Rocket, KeyRound, Calculator } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/components/ui/use-toast";
import { hasValidLicenseKey, isPro, saveLicenseKey } from "@/lib/license";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const ProInfo = () => {
  const [open, setOpen] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const alreadyPro = isPro();

  const handleActivate = () => {
    const candidate = licenseKey.trim();
    if (!hasValidLicenseKey(candidate)) {
      toast({ title: "Invalid license key", description: "Please check your key and try again." });
      return;
    }
    saveLicenseKey(candidate);
    toast({ title: "BreakEven Pro activated", description: "Thanks for your support!" });
    setOpen(false);
  };

  return (
    <div className="bg-background flex flex-col min-h-screen">
      <Helmet>
        <title>BreakEven Pro - BreakEven</title>
        <meta
          name="description"
          content="Unlock advanced calculators (Churn, MRR Simulator, Retention) and unlimited exports with a simple one-time license."
        />
        <link rel="canonical" href="https://breakeven.dev/pro" />
        <meta property="og:title" content="BreakEven Pro - Unlock All Tools" />
        <meta property="og:description" content="Unlock advanced calculators and unlimited exports with a one-time license." />
        <meta property="og:url" content="https://breakeven.dev/pro" />
      </Helmet>
      <Navigation />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 animate-slide-up">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                BreakEven Pro
              </h1>
              <p className="text-lg text-muted-foreground">
                Unlock all calculators, advanced simulations, and unlimited
                exports.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-emerald-600" />
                    <CardTitle className="text-base">Advanced Tools</CardTitle>
                  </div>
                  <CardDescription>
                    Churn Calculator, MRR Simulator, Retention Calculator
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Medal className="w-5 h-5 text-emerald-600" />
                    <CardTitle className="text-base">
                      Unlimited Exports
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Export results and scenarios without limits
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-emerald-600" />
                    <CardTitle className="text-base">
                      Simple, One-time License
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Instant unlock via license key
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card className="border-2 animate-slide-up">
              <CardHeader>
                <CardTitle>
                  {alreadyPro
                    ? "You're Pro ✨"
                    : "Get BreakEven Pro - Lifetime Access"}
                </CardTitle>
                <CardDescription>
                  {alreadyPro ? (
                    <span className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> License active. Enjoy
                      all features.
                    </span>
                  ) : (
                    "No recurring fees. Your license unlocks all current Pro features. Enter your license key to activate."
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!alreadyPro && (
                  <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
                    <Button asChild className="gap-2">
                      <a
                        href="https://www.buymeacoffee.com/breakeven"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <KeyRound className="w-5 h-5" />
                        Get BreakEven Pro (5$)
                      </a>
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="lg"
                          className="inline-flex items-center justify-center rounded-md border bg-background hover:bg-accent text-foreground transition-colors gap-2 text-base"
                        >
                          <ArrowRight className="w-5 h-5" />
                          Enter license key
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Activate BreakEven Pro</DialogTitle>
                          <DialogDescription>
                            Paste your license key below to unlock all features.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          <Label htmlFor="licenseKey">License key</Label>
                          <Input
                            id="licenseKey"
                            placeholder="e.g. BE-XXXX-XXXX"
                            value={licenseKey}
                            onChange={(e) => setLicenseKey(e.target.value)}
                            autoFocus
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            variant="ghost"
                            onClick={() => setOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={handleActivate}
                          >
                            Activate
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
                {alreadyPro && (
                  <div className="flex items-center justify-center">
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="gap-2 text-base"
                    >
                      <Link to="/">
                        <Calculator className="w-5 h-5" />
                        Go to calculators
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FAQ */}
            <div className="mt-12 animate-slide-up">
              <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-is-pro">
                  <AccordionTrigger>What is BreakEven Pro?</AccordionTrigger>
                  <AccordionContent>
                    BreakEven Pro unlocks advanced calculators (Churn, MRR
                    Simulator, Retention) and unlimited exports.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="how-to-activate">
                  <AccordionTrigger>
                    How do I activate my license?
                  </AccordionTrigger>
                  <AccordionContent>
                    Click "Enter license key" above, paste your key, and select
                    Activate. Your browser stores the license.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="subscription">
                  <AccordionTrigger>Is this a subscription?</AccordionTrigger>
                  <AccordionContent>
                    No, it is a one-time license for the currently available Pro
                    features.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Contact */}
            <div className="mt-12 animate-slide-up">
              <h2 className="text-2xl font-semibold mb-2">Contact</h2>
              <p className="text-muted-foreground">
                Facing any issues? Email us at{" "}
                <a
                  className="text-emerald-700 dark:text-emerald-400 underline"
                  href="mailto:breakeven.calculators@gmail.com"
                >
                  breakeven.calculators@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProInfo;


