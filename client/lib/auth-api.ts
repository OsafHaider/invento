import { apiFetch } from "./fetch-api-wrapper";


const BACKEND_URL= process.env.NEXT_PUBLIC_API_URL
export const authAPI = {
  signIn: async (data: { email: string; password: string }) => {
  const res = await fetch(`${BACKEND_URL}/api/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const result = await res.json();
  const accessToken=result.data.accessToken
  localStorage.setItem("accessToken", accessToken);

  return result; 
},


  signUp: async (data: { name: string; email: string; password: string }) => {
    const req = await fetch(`${BACKEND_URL}/api/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!req.ok) {
      throw new Error("Signup failed");
    }
const res=await req.json()
    return res;
  },

  profile: async () => {
    const res = await apiFetch(`${BACKEND_URL}/api/auth/profile`, {
      method: "GET",
    });

    if (!res?.ok) {
      throw new Error("Failed to fetch profile");
    }

    return res.json();
  },

 logout:async()=>{
  const req=await apiFetch(`${BACKEND_URL}/api/auth/logout`,{
    method:"POST",
    credentials:"include"
  })
  if(!req.ok){
    throw new Error("Logout failed");}
  localStorage.removeItem("accessToken");
   const res=await req.json()
    return res;
 }
};
