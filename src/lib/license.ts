const LICENSE_KEY_STORAGE = "breakeven_license_key";

export function isProEnabled(): boolean {
  const flag = import.meta.env.VITE_PRO_ENABLED;
  return String(flag).toLowerCase() === "true";
}

export function getStoredLicenseKey(): string | null {
  try {
    return localStorage.getItem(LICENSE_KEY_STORAGE);
  } catch {
    return null;
  }
}

export function saveLicenseKey(licenseKey: string): void {
  localStorage.setItem(LICENSE_KEY_STORAGE, licenseKey);
}

export function clearLicenseKey(): void {
  localStorage.removeItem(LICENSE_KEY_STORAGE);
}

export function hasValidLicenseKey(candidate?: string | null): boolean {
  const key = candidate ?? getStoredLicenseKey();
  if (!key) return false;
  // Very light validation: prefix + minimum length
  const normalized = key.trim();
  const looksValid = /^BE-?[A-Z0-9]{8,}$/i.test(normalized);
  return looksValid;
}

export function isPro(): boolean {
  return isProEnabled() || hasValidLicenseKey();
}


