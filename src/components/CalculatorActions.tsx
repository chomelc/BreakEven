import { Button } from "@/components/ui/button";
import { Download, FileImage, Clipboard, Link } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CalculatorActionsProps {
  onCopySummary: () => void;
  onShareLink: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  namespace: string;
}

export const CalculatorActions = ({
  onCopySummary,
  onShareLink,
  onExportPNG,
  onExportPDF,
  namespace,
}: CalculatorActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onCopySummary} variant="outline" size="sm">
        <Clipboard className="w-4 h-4" />
        {t(`${namespace}.actions.copySummary`)}
      </Button>
      <Button onClick={onShareLink} variant="outline" size="sm">
        <Link className="w-4 h-4" />
        {t(`${namespace}.actions.shareLink`)}
      </Button>
      <Button onClick={onExportPNG} variant="outline" size="sm">
        <FileImage className="w-4 h-4" />
        {t(`${namespace}.actions.png`)}
      </Button>
      <Button onClick={onExportPDF} variant="outline" size="sm">
        <Download className="w-4 h-4" />
        {t(`${namespace}.actions.pdf`)}
      </Button>
    </div>
  );
};

