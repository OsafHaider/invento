import { User } from "../models/user.js";
import type { AuthResponse } from "../types/index.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt.js";
const saltRounds = 10;
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: REFRESH_TOKEN_EXPIRY,
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    const normalizedEmail = email.toLowerCase();
const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
  email: normalizedEmail,
  password: hashedPassword,
  name,
});
    await newUser.save();

    const response: AuthResponse = {
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        role: newUser.role,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};


export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
  res.status(401).json({ error: "No refresh token provided" });
  return;
}

    const payload = verifyRefreshToken(token);
    if (!payload) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(200).json({
      accessToken: accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Token refresh failed" });
  }
};

export const profile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const response: AuthResponse = {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};
