/**
 * Returns the current month and year as a "YYYY-MM" string.
 * Used to detect month rollovers for per-month quota tracking.
 *
 * @param date - Optional date to use instead of now (useful for testing)
 */
export const getCurrentMonthYear = (date: Date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};
