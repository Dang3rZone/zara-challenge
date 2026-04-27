/**
 * Return a copy of `items` with later occurrences of duplicate `id`
 * values removed, preserving the order of first appearance.
 *
 * Useful for defensively cleaning API responses where the upstream may
 * emit the same record twice — React requires unique keys, and the
 * user-facing implication of showing the same SKU twice in a grid is
 * worse than silently quietly trimming.
 */
export function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
  }
  return result;
}
