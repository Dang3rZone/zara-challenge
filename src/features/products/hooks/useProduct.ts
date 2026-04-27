import { useEffect, useState } from 'react';
import { type AsyncState } from '@/shared/types/async';
import { getProductById } from '../api/products.api';
import { type Product } from '../types';

export function useProduct(id: string | undefined): AsyncState<Product> {
  const [state, setState] = useState<AsyncState<Product>>(
    id ? { status: 'loading' } : { status: 'idle' },
  );

  useEffect(() => {
    if (!id) {
      setState({ status: 'idle' });
      return;
    }

    const controller = new AbortController();
    setState({ status: 'loading' });

    getProductById(id, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({ status: 'success', data });
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
  }, [id]);

  return state;
}
