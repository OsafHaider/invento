export async function apiFetch(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("accessToken");

  // attach token
  options.headers = {
    ...options.headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "Content-Type": "application/json",
  };

  let res = await fetch(url, options);
console.log(res)
  // check if token expired
  if (res.status === 401) {
    // attempt refresh
    const refreshRes = await fetch("http://localhost:8080/api/auth/refresh", {
      method: "POST",
      credentials: "include", // cookie-based refresh
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("accessToken", data.accessToken);

      // retry original request
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${data.accessToken}`,
      };
      res = await fetch(url, options);
    } else {
      // refresh failed → force logout
      localStorage.removeItem("accessToken");
      window.location.href = "/sign-in"; // or router.push("/sign-in")
      return Promise.reject(new Error("Session expired"));
    }
  }

  return res;
}
