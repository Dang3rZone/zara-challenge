import { apiFetch } from '@/shared/api/client';
import { type Product, type ProductListItem } from '../types';

export interface GetProductsParams {
  search?: string;
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
}

/**
 * Fetch the product listing. Accepts an optional search term which is
 * server-side matched against brand or name.
 */
export function getProducts(params: GetProductsParams = {}): Promise<ProductListItem[]> {
  const { search, limit, offset, signal } = params;
  return apiFetch<ProductListItem[]>('/products', {
    query: { search, limit, offset },
    ...(signal !== undefined && { signal }),
  });
}

/**
 * Fetch the full detail payload for a single product.
 * Rejects with `ApiError` (status 404) if the product does not exist.
 */
export function getProductById(id: string, signal?: AbortSignal): Promise<Product> {
  return apiFetch<Product>(`/products/${encodeURIComponent(id)}`, {
    ...(signal !== undefined && { signal }),
  });
}
