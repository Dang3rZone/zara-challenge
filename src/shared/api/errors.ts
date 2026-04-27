/**
 * Error thrown when the API responds with a non-2xx status.
 * Carries enough context for UI layers to branch on `status` without
 * re-parsing the response.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;

  constructor(status: number, statusText: string, message?: string) {
    super(message ?? `API error ${status}: ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

/**
 * Error thrown when the request is aborted (either by caller cancellation
 * or by the timeout signal firing).
 */
export class ApiTimeoutError extends Error {
  constructor(message = 'The request timed out') {
    super(message);
    this.name = 'ApiTimeoutError';
  }
}
