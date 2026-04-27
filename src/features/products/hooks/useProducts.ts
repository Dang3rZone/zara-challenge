import { useEffect, useState } from 'react';
import { type AsyncState } from '@/shared/types/async';
import { dedupeById } from '@/shared/utils/dedupeById';
import { getProducts } from '../api/products.api';
import { type ProductListItem } from '../types';

interface UseProductsOptions {
  search: string;
  limit?: number;
}

/**
 * Load the product listing for a given search term. Aborts the in-flight
 * request when the search term changes, preventing out-of-order
 * responses from overwriting the UI with stale data.
 *
 * Defensively dedupes by `id` — the upstream API has been observed to
 * return the same SKU twice in a single response, which would otherwise
 * trigger React's duplicate-key warning and ship a confusing UX with two
 * identical "Add to cart" cards.
 */
export function useProducts({
  search,
  limit = 20,
}: UseProductsOptions): AsyncState<ProductListItem[]> {
  const [state, setState] = useState<AsyncState<ProductListItem[]>>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    setState((prev) => (prev.status === 'success' ? prev : { status: 'loading' }));

    getProducts({ search, limit, signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({ status: 'success', data: dedupeById(data) });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setState({
          status: 'error',
          error: err instanceof Error ? err : new Error('Unknown error'),
        });
      });

    return () => controller.abort();
  }, [search, limit]);

  return state;
}
