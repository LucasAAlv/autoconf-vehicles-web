import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Sanctum's CSRF cookie endpoint sits outside /api, so it needs the bare origin.
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

/** Shape of the API's RFC 7807 problem+json error body. */
export interface ApiProblem {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  // axios 1.6.2+ needs this in addition to withCredentials to actually
  // attach the XSRF-TOKEN cookie as the X-XSRF-TOKEN header.
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
  },
});

let csrfReady: Promise<void> | null = null;

/** Fetches the Sanctum CSRF cookie once per page load, ahead of any session request. */
export function ensureCsrfCookie() {
  if (!csrfReady) {
    csrfReady = axios
      .get(`${API_ORIGIN}/sanctum/csrf-cookie`, { withCredentials: true })
      .then(() => undefined);
  }
  return csrfReady;
}

/** Extracts a normalized problem+json body from a failed request, if present. */
export function getApiProblem(error: unknown): ApiProblem | null {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiProblem>;
    return axiosError.response?.data ?? null;
  }
  return null;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Session expired or was never established — let listeners (useAuth)
      // clear local state and the route guard bounce to /login.
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 419 &&
      !error.config?.headers?.["X-Retried-After-419"]
    ) {
      // CSRF token mismatch/expiry — refetch the cookie once and retry.
      csrfReady = null;
      return ensureCsrfCookie().then(() =>
        apiClient({
          ...error.config,
          headers: {
            ...error.config?.headers,
            "X-Retried-After-419": "1",
          },
        }),
      );
    }

    return Promise.reject(error);
  },
);
