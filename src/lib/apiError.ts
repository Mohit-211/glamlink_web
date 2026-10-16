/**
 * Reads the API's error envelope: `{ success: false, status, message, code, details? }`.
 * `code` is stable and the thing to branch on; `message` is written for people.
 */
export interface ApiError {
  status: number;
  code: string | null;
  message: string;
  details: Record<string, any> | null;
}

export function readApiError(error: any, fallback = "Something went wrong. Please try again."): ApiError {
  const body = error?.response?.data ?? error?.body ?? null;
  return {
    status: Number(error?.response?.status ?? body?.status ?? 0),
    code: typeof body?.code === "string" ? body.code : null,
    message:
      (typeof body?.message === "string" && body.message) ||
      (typeof error?.message === "string" && !error?.response && error.message) ||
      fallback,
    details: body?.details && typeof body.details === "object" ? body.details : null,
  };
}
