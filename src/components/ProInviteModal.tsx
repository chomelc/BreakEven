import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Medal, Lock, KeyRound, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ProInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLimitReached?: boolean;
}

export const ProInviteModal = ({ open, onOpenChange, isLimitReached = false }: ProInviteModalProps) => {
  const { t } = useTranslation();
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
                {t("proModal.limitReachedTitle")}
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6" />
                {t("proModal.unlockTitle")}
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {isLimitReached ? (
              t("proModal.limitReachedDesc")
            ) : (
              t("proModal.unlockDesc")
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-3">
            <div className="flex items-start gap-3">
              <Medal className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{t("proModal.unlimitedExports")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("proModal.unlimitedExportsDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{t("proModal.allAdvanced")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("proModal.allAdvancedDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Rocket className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{t("proModal.lifetimeAccess")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("proModal.lifetimeAccessDesc")}
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
            {t("proModal.maybeLater")}
          </Button>
          <Button
            asChild
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 w-full sm:w-auto"
          >
            <a
              href="https://www.buymeacoffee.com/breakeven"
              target="_blank"
              rel="noopener noreferrer"
            >
              <KeyRound className="w-5 h-5" />
              {t("proModal.getPro")}
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

