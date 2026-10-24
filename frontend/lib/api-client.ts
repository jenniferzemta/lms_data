/**
 * Base API client for DataMboa LMS.
 * Communicates with the Django REST backend using credentials (HTTP-only session cookies).
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ApiErrorResponse {
  code?: string;
  message: string;
  details?: Record<string, string | string[]>;
}

export class ApiError extends Error {
  code?: string;
  details?: Record<string, string | string[]>;
  status: number;

  constructor(status: number, message: string, code?: string, details?: Record<string, string | string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const csrfToken = getCsrfToken();
  if (csrfToken && !headers['X-CSRFToken'] && options.method && options.method !== 'GET') {
    headers['X-CSRFToken'] = csrfToken;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Guarantees session cookies are sent and received
  });

  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred.';
    let errorCode: string | undefined;
    let errorDetails: Record<string, string | string[]> | undefined;

    try {
      const data = await response.json();
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data.message) {
        errorMessage = data.message;
        errorCode = data.code;
        errorDetails = data.details;
      } else if (data.detail) {
        errorMessage = data.detail;
      } else if (typeof data === 'object') {
        // Collect field validation errors from DRF
        const firstKey = Object.keys(data)[0];
        const val = data[firstKey];
        errorMessage = Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val);
        errorDetails = data;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiError(response.status, errorMessage, errorCode, errorDetails);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
