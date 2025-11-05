import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import GB from "country-flag-icons/react/3x2/GB";
import FR from "country-flag-icons/react/3x2/FR";
import DE from "country-flag-icons/react/3x2/DE";
import ES from "country-flag-icons/react/3x2/ES";
import NL from "country-flag-icons/react/3x2/NL";

const languages = [
  { code: "en", name: "English", nativeName: "English", Flag: GB },
  { code: "fr", name: "French", nativeName: "Français", Flag: FR },
  { code: "de", name: "German", nativeName: "Deutsch", Flag: DE },
  { code: "es", name: "Spanish", nativeName: "Español", Flag: ES },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", Flag: NL },
];

interface LanguageToggleProps {
  showLabel?: boolean;
  hideLabel?: boolean; // forces label hidden regardless of device size
  className?: string; // optional className to control responsive visibility from parent
}

export function LanguageToggle({ showLabel = false, hideLabel = false, className = "" }: LanguageToggleProps) {
  const { i18n } = useTranslation();
  const isMobile = useIsMobile();

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const shouldShowLabel = !hideLabel && (showLabel || !isMobile);

  const CurrentFlag = currentLanguage.Flag;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`gap-2 ${className}`}>
          <CurrentFlag className="w-5 h-4 rounded-sm" />
          {shouldShowLabel && (
            <span>{currentLanguage.nativeName}</span>
          )}
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => {
          const Flag = language.Flag;
          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Flag className="w-5 h-4 rounded-sm" />
                <span>{language.nativeName}</span>
              </span>
              {i18n.language === language.code && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

