// Single source of truth for Labex's age so year-counts never go stale.
export const FOUNDED_YEAR = 1979;

/** Years Labex has been trading (currentYear − 1979). Returns 47 in 2026. */
export function yearsTrading(): number {
  return new Date().getFullYear() - FOUNDED_YEAR;
}
