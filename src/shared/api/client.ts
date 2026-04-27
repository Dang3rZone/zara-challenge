import { ApiError, ApiTimeoutError } from './errors';

/**
 * Default values match the public credentials published in the challenge
 * brief, so the app boots correctly without a local `.env` file. A user
 * who wants to point at a different deployment can override either value
 * via `VITE_API_BASE_URL` / `VITE_API_KEY` in `.env`.
 */
const DEFAULT_BASE_URL = 'https://prueba-tecnica-api-tienda-moviles.onrender.com';
const DEFAULT_API_KEY = '87909682e6cd74208f41a6ef39fe4191';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY || DEFAULT_API_KEY;

/**
 * Default request timeout.
 *
 * The API is hosted on a Render free tier that spins down after inactivity;
 * cold starts can take 30-60s on the first request. A generous default keeps
 * the initial page load reliable without hanging indefinitely if the host
 * is genuinely unreachable.
 */
const DEFAULT_TIMEOUT_MS = 60_000;

export interface RequestOptions extends Omit<RequestInit, 'signal'> {
  /** Caller-provided abort signal; composed with the internal timeout. */
  signal?: AbortSignal;
  /** Per-call timeout override. Pass `0` to disable the timeout. */
  timeoutMs?: number;
  /** Flat record of query parameters appended to the URL. */
  query?: Record<string, string | number | boolean | null | undefined>;
}

function buildUrl(path: string, query: RequestOptions['query']): string {
  const url = new URL(path, BASE_URL);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined || value === '') continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * Merge a caller-provided AbortSignal with an internal timeout signal.
 * Uses the native `AbortSignal.any` (widely available in evergreen browsers
 * and Node 20+); falls back to a manual controller otherwise.
 */
function composeSignals(external: AbortSignal | undefined, timeoutMs: number): AbortSignal {
  const timeoutSignal = timeoutMs > 0 ? AbortSignal.timeout(timeoutMs) : undefined;
  if (external && timeoutSignal) {
    return AbortSignal.any([external, timeoutSignal]);
  }
  return external ?? timeoutSignal ?? new AbortController().signal;
}

/**
 * Perform a JSON request against the mobile phones API.
 *
 * Injects `x-api-key` and `Accept: application/json`, applies a default
 * timeout suitable for Render cold-starts, and normalises failure modes
 * into `ApiError` / `ApiTimeoutError`.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, signal, timeoutMs = DEFAULT_TIMEOUT_MS, headers, ...rest } = options;

  let response: Response;
  try {
    const url = buildUrl(path, query);
    response = await fetch(url, {
      ...rest,
      headers: {
        Accept: 'application/json',
        'x-api-key': API_KEY,
        ...headers,
      },
      signal: composeSignals(signal, timeoutMs),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      throw new ApiTimeoutError();
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    if (err instanceof TypeError && err.message.includes('Invalid URL')) {
      throw new ApiError(
        0,
        'Invalid API URL',
        `Could not build a valid URL from base "${BASE_URL}" and path "${path}"`,
      );
    }
    throw new ApiError(0, 'Network error', err instanceof Error ? err.message : undefined);
  }

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }

  return (await response.json()) as T;
}
