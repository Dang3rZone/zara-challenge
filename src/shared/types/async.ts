/**
 * Discriminated union describing the full lifecycle of an async request.
 * Using a union (rather than `{ loading, error, data }` with all three
 * optional) lets TypeScript narrow the state inside render and prevents
 * "loading but also has data" bugs.
 */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
