const formatter = new Intl.NumberFormat('en-GB', {
  style: 'decimal',
  maximumFractionDigits: 0,
});

/**
 * Format a price as an integer with the EUR suffix, matching the Figma
 * style (e.g. "1219 EUR"). The API returns numeric prices in whole euros
 * so no decimal handling is needed.
 */
export function formatPrice(value: number): string {
  return `${formatter.format(value)} EUR`;
}
