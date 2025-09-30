import {ApiError} from '../api-error';

export function extractApiMsg(err: unknown, fallback = 'Failed to place order'): string {
  const anyErr: any = err;

  const api = (anyErr?.error ?? {}) as Partial<ApiError>;

  return api.debugMessage
    ?? api.message
    ?? anyErr?.message
    ?? fallback;
}
