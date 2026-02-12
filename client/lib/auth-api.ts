const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Get tokens from storage
export const getTokens = () => {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null };
  
  const accessToken = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  
  let refreshToken = null;
  if (user) {
    try {
      const userData = JSON.parse(user);
      refreshToken = userData.refreshToken;
    } catch (e) {
      // Error parsing user data
    }
  }
  
  return { accessToken, refreshToken };
};

// Set tokens in storage
const setTokens = (accessToken: string, user: User & { refreshToken: string }) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("user", JSON.stringify(user));
};

// Clear tokens from storage
export const clearTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

// Check if token is expired (rough estimate)
const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    
    const payload = JSON.parse(atob(parts[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (e) {
    return true;
  }
};

// Refresh access token
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { refreshToken } = getTokens();
    
    if (!refreshToken) {
      clearTokens();
      window.location.href = "/sign-in";
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });

    if (!response.ok) {
      clearTokens();
      window.location.href = "/sign-in";
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;

    // Update access token in storage
    localStorage.setItem("accessToken", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Token refresh error:", error);
    clearTokens();
    window.location.href = "/sign-in";
    return null;
  }
};

export const authAPI = {
  async signUp(data: SignUpData): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Sign up failed");
    }

    const result = await response.json();
    setTokens(result.accessToken, { ...result.user, refreshToken: result.refreshToken });
    return result;
  },

  async signIn(data: SignInData): Promise<{ user: User & { refreshToken: string }; accessToken: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Sign in failed");
    }

    const result = await response.json();
    setTokens(result.accessToken, result.user);
    return result;
  },

  async getProfile(): Promise<{ user: User }> {
    let { accessToken } = getTokens();

    if (!accessToken) {
      clearTokens();
      window.location.href = "/sign-in";
      throw new Error("No access token");
    }

    // Check if token is expired or about to expire
    if (isTokenExpired(accessToken)) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Token refresh failed");
      accessToken = newToken;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (response.status === 401) {
      // Try to refresh token
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry with new token
        return this.getProfile();
      }
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch profile");
    }

    return response.json();
  },

  logout() {
    clearTokens();
    window.location.href = "/sign-in";
  },
};
