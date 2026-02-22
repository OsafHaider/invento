import { getAccessToken, setAccessToken, clearAccessToken } from "./token";

const BASE_URL = "http://localhost:8080";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function handleRefreshToken() {
  if (!isRefreshing) {
    isRefreshing = true;

    refreshPromise = (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Refresh failed");

        const result = await res.json();

        if (!result.success) throw new Error(result.message);

        setAccessToken(result.data.accessToken);

      } catch (err) {
        // 🔥 Optional: frontend handles missing token gracefully
        clearAccessToken();
        // Do NOT redirect automatically → avoid loop
        console.warn("Refresh token failed or missing:", err);
      } finally {
        isRefreshing = false;
      }
    })();
  }

  return refreshPromise;
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  retry = true
) {
  try {
    const token = getAccessToken();

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers,
      },
      credentials: "include",
    });

    if (response.status === 401 && retry) {
      await handleRefreshToken();
      return apiFetch(endpoint, options, false);
    }

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw {
        status: response.status,
        message: result?.message || "Something went wrong",
      };
    }

    if (!result.success) {
      throw {
        status: response.status,
        message: result.message,
      };
    }

    return result;

  } catch (error:any) {
    throw {
      status: error?.status || 500,
      message: error?.message || "Network error",
    };
  }
}