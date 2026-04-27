import { useEffect, useState } from 'react';

/**
 * Return a debounced copy of `value`. The returned value only updates
 * after `delayMs` has elapsed without further changes to `value`.
 *
 * Useful for deriving a "stable" search query from a fast-typing input
 * without wiring up refs or external debounce utilities.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}
