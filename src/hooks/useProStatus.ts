import { useState, useEffect } from "react";
import { hasValidLicenseKeySync, isPro } from "@/lib/license";

export const useProStatus = () => {
  const [isProUser, setIsProUser] = useState(() => hasValidLicenseKeySync());

  useEffect(() => {
    isPro().then(setIsProUser);
    
    const handleProStatusChange = () => {
      setIsProUser(hasValidLicenseKeySync());
      isPro().then(setIsProUser);
    };
    
    window.addEventListener('proStatusChanged', handleProStatusChange);
    
    return () => {
      window.removeEventListener('proStatusChanged', handleProStatusChange);
    };
  }, []);

  return isProUser;
};

