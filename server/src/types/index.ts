export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  role:string
}

export interface JwtPayload {
  id: string;
  email: string;
  role:string
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  user: Omit<User, "password">;
}

