import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Medal, Lock, KeyRound, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface ProInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLimitReached?: boolean;
}

export const ProInviteModal = ({ open, onOpenChange, isLimitReached = false }: ProInviteModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background/95 border-2 border-emerald-500/20 shadow-2xl">
        <style>{`
          [data-radix-dialog-overlay] {
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            background-color: rgba(0, 0, 0, 0.5) !important;
          }
        `}</style>
        <DialogHeader>
          <DialogTitle
            className={`text-2xl font-bold flex items-center gap-2 ${
              isLimitReached
                ? "text-orange-600 dark:text-orange-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isLimitReached ? (
              <>
                <AlertCircle className="w-6 h-6" />
                Export Limit Reached
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6" />
                Unlock BreakEven Pro
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {isLimitReached ? (
              <>
                You've reached your monthly export limit (5 exports). Get
                BreakEven Pro for unlimited exports and access to all advanced
                calculators!
              </>
            ) : (
              <>Get unlimited exports and access to all advanced calculators!</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-3">
            <div className="flex items-start gap-3">
              <Medal className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Unlimited Exports</p>
                <p className="text-sm text-muted-foreground">
                  Export your results without any monthly limits
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">All Advanced Calculators</p>
                <p className="text-sm text-muted-foreground">
                  Churn Calculator, MRR Simulator, Retention Calculator
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Rocket className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Lifetime Access</p>
                <p className="text-sm text-muted-foreground">
                  One-time payment, no recurring fees
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
          <Button
            asChild
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 w-full sm:w-auto"
          >
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
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

