const LICENSE_KEY_STORAGE = "breakeven_license_key";
const PRO_VALID_FLAG = "breakeven_pro_valid";
const VALID_KEYS_URL = "/valid-keys.json";

// Cache for valid key hashes
let validKeyHashesCache: Set<string> | null = null;

/**
 * Hash a string using SHA256
 */
async function hashSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Load valid key hashes from the JSON file
 */
async function loadValidKeyHashes(): Promise<Set<string>> {
  if (validKeyHashesCache) {
    return validKeyHashesCache;
  }

  try {
    const response = await fetch(VALID_KEYS_URL);
    if (!response.ok) {
      console.warn('Failed to load valid keys file');
      return new Set();
    }
    const data = await response.json();
    validKeyHashesCache = new Set(data.hashes || []);
    return validKeyHashesCache;
  } catch (error) {
    console.warn('Error loading valid keys:', error);
    return new Set();
  }
}

// Removed isProEnabled() - now relying solely on license key validation
export function isProEnabled(): boolean {
  return false;
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
  localStorage.removeItem(PRO_VALID_FLAG);
  // Clear cache to force reload
  validKeyHashesCache = null;
}

export function getProValidFlag(): boolean {
  try {
    return localStorage.getItem(PRO_VALID_FLAG) === "true";
  } catch {
    return false;
  }
}

export function setProValidFlag(valid: boolean): void {
  try {
    localStorage.setItem(PRO_VALID_FLAG, valid ? "true" : "false");
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Check if a license key is valid by comparing its SHA256 hash against the valid keys
 */
export async function hasValidLicenseKey(candidate?: string | null): Promise<boolean> {
  const key = candidate ?? getStoredLicenseKey();
  if (!key) return false;

  // Normalize the key (trim and handle dashes)
  const normalized = key.trim().toUpperCase();
  
  // Basic format validation - allows BE-XXXX-XXXX format with dashes
  if (!/^BE-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(normalized)) {
    return false;
  }

  // Load valid key hashes
  const validHashes = await loadValidKeyHashes();
  if (validHashes.size === 0) {
    // If we can't load the file, fall back to basic format check
    return true; // Allow basic format as fallback
  }

  // Hash the candidate key
  const keyHash = await hashSHA256(normalized);
  
  // Check if hash exists in valid keys
  const isValid = validHashes.has(keyHash);
  
  // If valid and this is a new check (not just retrieving stored), set the flag
  if (isValid && candidate) {
    setProValidFlag(true);
  }
  
  return isValid;
}

/**
 * Synchronous check using the stored flag (for UI that needs immediate response)
 */
export function hasValidLicenseKeySync(): boolean {
  return getProValidFlag();
}

export async function isPro(): Promise<boolean> {
  // Check stored flag first for quick response
  if (hasValidLicenseKeySync()) return true;
  // Then do async validation
  return await hasValidLicenseKey();
}


