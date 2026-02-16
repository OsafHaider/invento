const BACKEND_URL=process.env.NEXT_PUBLIC_API_URL
export async function apiFetch(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("accessToken");

  options.headers = {
    ...options.headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "Content-Type": "application/json",
  };

  let res = await fetch(url, options);
  if (res.status === 401) {
    const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("accessToken", data.data.accessToken);

      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${data.data.accessToken}`,
      };
      res = await fetch(url, options);
    } else {
      localStorage.removeItem("accessToken");
      window.location.href = "/sign-in";
      return Promise.reject(new Error("Session expired"));
    }
  }

  return res;
}
