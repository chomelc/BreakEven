const EXPORT_COUNT_KEY = "breakeven_export_count";
const EXPORT_MONTH_KEY = "breakeven_export_month";

/**
 * Get the current month key (YYYY-MM format)
 */
function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Get the current export count for this month
 */
export function getCurrentMonthExportCount(): number {
  try {
    const currentMonth = getCurrentMonthKey();
    const storedMonth = localStorage.getItem(EXPORT_MONTH_KEY);
    
    // If month changed, reset count
    if (storedMonth !== currentMonth) {
      localStorage.setItem(EXPORT_COUNT_KEY, "0");
      localStorage.setItem(EXPORT_MONTH_KEY, currentMonth);
      return 0;
    }
    
    const count = localStorage.getItem(EXPORT_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Increment the export count for this month
 */
export function incrementExportCount(): void {
  try {
    const currentMonth = getCurrentMonthKey();
    const storedMonth = localStorage.getItem(EXPORT_MONTH_KEY);
    
    // If month changed, reset count
    if (storedMonth !== currentMonth) {
      localStorage.setItem(EXPORT_COUNT_KEY, "1");
      localStorage.setItem(EXPORT_MONTH_KEY, currentMonth);
      return;
    }
    
    const currentCount = getCurrentMonthExportCount();
    localStorage.setItem(EXPORT_COUNT_KEY, String(currentCount + 1));
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Check if user has reached the export limit (5 exports per month for non-Pro users)
 */
export function hasReachedExportLimit(): boolean {
  return getCurrentMonthExportCount() >= 5;
}

/**
 * Get remaining exports for this month
 */
export function getRemainingExports(): number {
  const current = getCurrentMonthExportCount();
  return Math.max(0, 5 - current);
}

