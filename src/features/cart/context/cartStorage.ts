import { type CartLineItem, type CartState } from '../types';

const STORAGE_KEY = 'zara-challenge:cart:v1';

/**
 * Narrow an `unknown` blob to `CartState` without trusting the storage layer.
 * Any malformed data (hand-edited localStorage, schema drift between
 * deployments) is treated as "no prior state" rather than crashing.
 */
function isCartLineItem(value: unknown): value is CartLineItem {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.lineId === 'string' &&
    typeof v.productId === 'string' &&
    typeof v.brand === 'string' &&
    typeof v.name === 'string' &&
    typeof v.imageUrl === 'string' &&
    typeof v.color === 'object' &&
    v.color !== null &&
    typeof v.storage === 'object' &&
    v.storage !== null
  );
}

export function loadCartState(): CartState {
  if (typeof window === 'undefined') return { items: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return { items: [] };
    const candidate = parsed as { items?: unknown };
    if (!Array.isArray(candidate.items)) return { items: [] };
    return { items: candidate.items.filter(isCartLineItem) };
  } catch {
    return { items: [] };
  }
}

export function saveCartState(state: CartState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or disabled — ignore */
  }
}
