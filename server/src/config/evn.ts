import dotenv from "dotenv";

dotenv.config();

function getEnvVariable(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: parseInt(process.env.PORT || "8080", 10),

  DATABASE_URL: getEnvVariable("DATABASE_URL"),
  CLIENT_URL: getEnvVariable("CLIENT_URL"),

  ACCESS_TOKEN_SECRET: getEnvVariable("ACCESS_TOKEN_SECRET"),

  REFRESH_TOKEN_SECRET: getEnvVariable("REFRESH_TOKEN_SECRET"),
};
